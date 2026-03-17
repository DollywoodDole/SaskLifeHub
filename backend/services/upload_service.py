"""
File upload service — local storage now, S3-ready.

To switch to S3, set these env vars:
    STORAGE_BACKEND=s3
    AWS_ACCESS_KEY_ID=...
    AWS_SECRET_ACCESS_KEY=...
    AWS_REGION=ca-central-1
    S3_BUCKET=sasklifehub-uploads
"""
import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"}
MAX_IMAGES_PER_LISTING = 8


def _allowed(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def _unique_filename(original: str) -> str:
    ext = original.rsplit(".", 1)[1].lower()
    return f"{uuid.uuid4().hex}.{ext}"


# ---------------------------------------------------------------------------
# Local storage
# ---------------------------------------------------------------------------

def _upload_local(file, upload_folder: str) -> str:
    os.makedirs(upload_folder, exist_ok=True)
    filename = _unique_filename(secure_filename(file.filename))
    file.save(os.path.join(upload_folder, filename))
    return f"/uploads/{filename}"


def _delete_local(url: str, upload_folder: str) -> None:
    filename = url.lstrip("/uploads/")
    path = os.path.join(upload_folder, filename)
    if os.path.exists(path):
        os.remove(path)


# ---------------------------------------------------------------------------
# S3 storage (boto3 required — pip install boto3)
# ---------------------------------------------------------------------------

def _upload_s3(file, bucket: str, region: str) -> str:
    import boto3
    s3 = boto3.client("s3", region_name=region)
    filename = _unique_filename(secure_filename(file.filename))
    ext = filename.rsplit(".", 1)[1].lower()
    content_type = f"image/{ext}" if ext != "jpg" else "image/jpeg"
    s3.upload_fileobj(
        file,
        bucket,
        filename,
        ExtraArgs={"ContentType": content_type, "ACL": "public-read"},
    )
    return f"https://{bucket}.s3.{region}.amazonaws.com/{filename}"


def _delete_s3(url: str, bucket: str, region: str) -> None:
    import boto3
    key = url.split(".amazonaws.com/", 1)[-1]
    boto3.client("s3", region_name=region).delete_object(Bucket=bucket, Key=key)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def upload_image(file) -> str:
    """Upload a single image file. Returns the public URL."""
    if not file or not file.filename:
        raise ValueError("No file provided")
    if not _allowed(file.filename):
        raise ValueError(f"File type not allowed. Accepted: {', '.join(ALLOWED_EXTENSIONS)}")

    backend = os.environ.get("STORAGE_BACKEND", "local")

    if backend == "s3":
        bucket = os.environ["S3_BUCKET"]
        region = os.environ.get("AWS_REGION", "ca-central-1")
        return _upload_s3(file, bucket, region)

    return _upload_local(file, current_app.config["UPLOAD_FOLDER"])


def delete_image(url: str) -> None:
    """Delete an image by its URL. Silently ignores missing files."""
    if not url:
        return
    try:
        backend = os.environ.get("STORAGE_BACKEND", "local")
        if backend == "s3":
            bucket = os.environ["S3_BUCKET"]
            region = os.environ.get("AWS_REGION", "ca-central-1")
            _delete_s3(url, bucket, region)
        else:
            _delete_local(url, current_app.config["UPLOAD_FOLDER"])
    except Exception:
        pass


def upload_images(files) -> list[str]:
    """Upload multiple image files. Returns list of URLs."""
    urls = []
    for file in files:
        if file and file.filename:
            urls.append(upload_image(file))
    return urls
