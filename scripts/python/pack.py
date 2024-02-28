#!/usr/bin/env python3

# MIT License
# Copyright (c) Falcion 2023-2024
# Free to share, use or change.

import os
import zipfile

repo_root = "./../../"

script_dir = os.path.join(repo_root, "scripts", "python")

zip_filename = "repo_backup.zip"
zip_file = zipfile.ZipFile(os.path.join(script_dir, zip_filename), "w", zipfile.ZIP_DEFLATED)

for root, dirs, files in os.walk(repo_root):
    if ".git" in dirs:
        dirs.remove(".git")
    for file in files:
        file_path = os.path.join(root, file)
        zip_file.write(file_path, os.path.relpath(file_path, repo_root))

zip_file.close()

print("Repository compressed into", zip_filename)
