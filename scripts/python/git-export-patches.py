#!/usr/bin/env python3

# MIT License.
#
# Copyright (c) Electron contributors
# Copyright (c) 2013-2020 GitHub Inc.

import argparse
import sys

from lib import git  # type: ignore


def main(argv) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-o",
        "--output",
        help="directory into which exported patches will be written",
        required=True,
    )
    parser.add_argument(
        "patch_range",
        nargs="?",
        help="range of patches to export. Defaults to all commits since the "
        "most recent tag or remote branch.",
    )
    args = parser.parse_args(argv)

    git.export_patches(".", args.output, patch_range=args.patch_range)

    return 0


if __name__ == "__main__":
    main(sys.argv[1:])
