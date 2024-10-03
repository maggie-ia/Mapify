def validate_file_type(filename, allowed_extensions):
    if '.' not in filename:
        raise ValueError("No file extension")
    ext = filename.rsplit('.', 1)[1].lower()
    if ext not in allowed_extensions:
        raise ValueError(f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}")

def validate_file_size(file, max_size):
    file.seek(0, 2)  # Move to the end of the file
    file_size = file.tell()  # Get the position (size)
    file.seek(0)  # Reset file position
    if file_size > max_size:
        raise ValueError(f"File size exceeds the limit of {max_size / (1024 * 1024):.2f} MB")