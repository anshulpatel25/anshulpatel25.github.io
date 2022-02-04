+++
author = "Anshul Patel"
date = 2020-04-06
showthedate = true
title = "Compilers, Interpreters, Transpilers and Strategies"
tags = [
    "devops",
    "programming",
    "performance",
    "scalability"
]
+++

This blog provides overview on software compilation and strategies.

<!--more-->

## What is Compiler?

A compiler is a computer program that translates programming language code into machine code.

**For example:** C, C++, RUST, Golang, .NET

## What is Interpreter?

An interpreter is a computer program that directly executes the programming language code without requiring it to be compiled. The instructions are converted into an intermedia code format called the **ByteCode** which is then executed by Programming Language specific virtual machine which converts the intermediate code to the machine code.

**For example:** Python, Ruby, Javascript

## What is Transpiler (Source-to-Source Compiler)?

A transpiler is a computer program that translates programming code of particular language into either the same programming language or different programming language.

**For Example:** Babel, HipHop

## Compilation Strategies

### Ahead of Time Compilation (AOT)

An Ahead of Time compiler translates programming language code into native machine code for the targeted architecture and operating system.

The code is always compiled before executing it.

#### Characteristics

* Low Runtime CPU and Memory Usage.
* Application/Program startup is fast.
* Code is required to be generated for different combination of microprocesser architecture (**For example:** ARM, X64_32, X86_64, RISC) and operating systems (**For example:** Linux, Windows, FreeBSD).

### Just in Time Compilation (JIT)

A Just in Time compiler translates the programming language code into native machine code while execution at runtime. Generally, the programming languages which uses JIT strategy, converts the programming language code into an intermediate format which is then interpreted by programming language specific virtual machine to machine code.

JIT continuously analyzes the code and performs dynamic compilation of only required sections of code which could accelerate the execution.


#### Characteristics

* JITs are usually part of Programming Language specific virtual machine, hence the same code can be directly run on programming language specific virtual machine for different combination of microprocessor architecture and operating systems.
* It performs adaptive and dynamic optimization at runtime to increase the execution performance.
* As it continuosly profiles and analyzes the code, it has extra CPU and Memory usage.
* Application/Program startup is relatively slow.


