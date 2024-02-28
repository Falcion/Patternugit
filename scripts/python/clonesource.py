#!/usr/bin/env python3

# MIT License
# Copyright (c) Falcion 2023-2024
# Free to share, use or change.

import shutil
import os

def confirm_copy():
    while True:
        response = input("Do you want to copy the files? (y/n): ").strip().lower()
        if response in ("y", "n"):
            return response == "y"
        else:
            print("Invalid input. Please enter 'y' or 'n'.")

source_dir = "./../../"  # Root directory
destination_dir = "source"  # Destination folder

files_to_copy = ["main.ts", "manifest.json"]

if not os.path.exists(destination_dir):
    os.makedirs(destination_dir)

if confirm_copy():
    for file_name in files_to_copy:
        source_path = os.path.join(source_dir, file_name)
        destination_path = os.path.join(destination_dir, file_name)
        
        try:
            shutil.copy(source_path, destination_path)
            print(f"Copied {file_name} to {destination_dir}")
        except FileNotFoundError:
            print(f"File {file_name} not found in the root directory.")

    print("Copy process completed.")
else:
    print("Copy process aborted.")
