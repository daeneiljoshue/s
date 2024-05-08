#!/usr/bin/env python3
#
# Copyright (C) 2022 CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

<<<<<<< HEAD
import os
import os.path as osp
=======
>>>>>>> cvat/develop
import subprocess
import sys
from argparse import ArgumentParser, Namespace
from concurrent.futures import ThreadPoolExecutor
from functools import partial
<<<<<<< HEAD
from glob import glob
from typing import Optional, Sequence

=======
from typing import Optional, Sequence
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[5]
>>>>>>> cvat/develop

def create_arg_parser() -> ArgumentParser:
    parser = ArgumentParser(add_help=True)
    parser.add_argument(
<<<<<<< HEAD
        "-c",
        "--config-dir",
        default=None,
        help="The directory with test configs in CSV format (default: the default location)",
    )
    parser.add_argument(
        "-g",
        "--gen-dir",
        default=None,
        help="The directory with test generators (default: the default location)",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        default=".",
        type=osp.abspath,
        help="The output directory for rego files (default: current dir)",
=======
        "-a",
        "--apps-dir",
        type=Path,
        default=REPO_ROOT / "cvat/apps",
        help="The directory with Django apps (default: cvat/apps)",
>>>>>>> cvat/develop
    )
    return parser


def parse_args(args: Optional[Sequence[str]] = None) -> Namespace:
    parser = create_arg_parser()
    parsed_args = parser.parse_args(args)
    return parsed_args


<<<<<<< HEAD
def call_generator(module_path: str, gen_params: Namespace):
    subprocess.check_call(
        ["python3", module_path, gen_params.config_dir], cwd=gen_params.output_dir
=======
def call_generator(generator_path: Path, gen_params: Namespace) -> None:
    rules_dir = generator_path.parents[2]
    subprocess.check_call(
        [sys.executable, generator_path.relative_to(rules_dir), 'tests/configs'], cwd=rules_dir
>>>>>>> cvat/develop
    )


def main(args: Optional[Sequence[str]] = None) -> int:
    args = parse_args(args)

<<<<<<< HEAD
    args.config_dir = osp.abspath(args.config_dir or osp.join(osp.dirname(__file__), "configs"))
    args.gen_dir = osp.abspath(args.gen_dir or osp.join(osp.dirname(__file__), "generators"))

    assert osp.isdir(args.config_dir)
    assert osp.isdir(args.gen_dir)

    os.makedirs(args.output_dir, exist_ok=True)

    with ThreadPoolExecutor() as pool:
        pool.map(
            partial(call_generator, gen_params=args),
            glob(osp.join(args.gen_dir, "*_test.gen.rego.py")),
        )
=======
    generator_paths = list(args.apps_dir.glob("*/rules/tests/generators/*_test.gen.rego.py"))

    if not generator_paths:
        sys.exit("error: no generators found")

    with ThreadPoolExecutor() as pool:
        for _ in pool.map(
            partial(call_generator, gen_params=args),
            generator_paths,
        ):
            pass # consume all results in order to propagate exceptions
>>>>>>> cvat/develop


if __name__ == "__main__":
    sys.exit(main())
