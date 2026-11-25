# MacroMag OS - static site

Pages: index, license, about, job, apply, certification, contact, docs.
Upload everything in this folder to the root of your `username.github.io` repository (keep the `img/` folder).

Optional images (the site works without them): `img/hero.jpg`, `img/job.jpg`, `img/maldyrek.jpg`.
MacroMag OS is an experimental, open-source Linux distribution built from the ground up in Rust and C to eliminate legacy GNU userland clutter and reduce e-waste by running efficiently on older 64-bit hardware.

Instead of relying on traditional POSIX text-stream shells like Bash, MacroMag boots a stripped-down Linux kernel directly into the Virtualized Object Shell (VOS) as PID 1. VOS executes strongly-typed, in-memory object pipelines and provides native kernel-level process sandboxing directly within the shell syntax.

Key features:
- Virtualized Object Shell (VOS): Strongly-typed object pipelines, native memory unit awareness, and built-in sandbox execution without heavy container runtimes.
- MacroMag User Repository (MUR): A lightweight, git-free package manager written in Rust with SHA-256 checksum verification.
- Zero Telemetry: Self-contained core with no background cloud polling or tracking.
- Hardware Compatibility: Supports x86_64 PCs, legacy laptops, and open RISC-V architectures.
