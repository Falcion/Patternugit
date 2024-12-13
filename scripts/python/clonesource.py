#!/usr/bin/env python3

# MIT License
# Copyright (c) Falcion 2023-2024
# Free to share, use or change.

import os
import shutil

ROOT, TARGET = "./../../", "source"


def confirm_copy():
    while True:
        response = input("Do you want to copy the files? (Y/N): ").strip().upper()

        if response in ("Y", "N"):
            return response == "Y"
        else:
            print("Invalid input, please, enter 'Y' or 'N' as an answer.")


COPIED_FILES = ["main.ts", "manifest.json"]

try:
    if not os.path.exists(TARGET):
        os.makedirs(TARGET)

    for file in COPIED_FILES:
        filepath = os.path.join(ROOT, file)
        copypath = os.path.join(TARGET, file)

        try:
            shutil.copy(filepath, copypath)
            print(f'Entity "{file}" was copied to "{TARGET}" successfully.')
        except FileNotFoundError:
            print(f"Entity {file} not found in the root directory.")
        except PermissionError:
            print(f"Permission denied while accessing {file}.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

    print("Copy process completed.")
except Exception as e:
    print(f"Copy process aborted due to an error: {e}")
