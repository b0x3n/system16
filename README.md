# System16

You can view a live demo [here](https://b0x3n.github.io/system16/)

It might not look like there's much going on but there there is.

If you check the demo you'll be presented with a simple looking display that looks similar to a terminal, there's a blinking cursor and you can input a string of text and hit return and whatever you input will be echo'd back to you, nothing special.

But, honestly it kinda is! What is really happening is the browser is fetching a binary executable (*bytecode*) and loading it into virtual __RAM__, then a virtual __CPU__ is executing the bytecode in the browser...the bytecode/program being executed implements a simple __REPL__ that reads a line of input and writes it to the *terminal* display.

The *bytecode* is the output of an assembler (__s16a__) and linker (__s16l__), these applications (written in __Node__) are used to assemble and link source files written in a simple __assembly__ language I created - you can see the source for the *echo shell* [here](https://github.com/b0x3n/system16/tree/master/s16/asm)

The assembler can be found [here](https://github.com/b0x3n/system16/tree/master/s16a)
The liner can be found [here](https://github.com/b0x3n/system16/tree/master/s16l)
The binary (*bytecode*) executable can be found [here](https://github.com/b0x3n/system16/tree/master/s16/exe)

## The assembly language

The assembly language is farily simple - there's a handful of instructions, enough to get something done, like build the simple shell you see running in the terminal.

We have a stack which we can push and pop to and from, we even have a call instruction that allows us to invoke other functions using the standard __C__ calling convention, we have interrupts, registers, etc.

The front-end implements an interface that mimics a terminal, if you've programmed in __ncurses__ before you'll be familiar with the concept, each *character cell* can be addressed individually using line/column values - the browser is just loading the pre-assembled bytecode/executable into virtual __RAM__ then letting the virtual __CPU__ do it's thing until the program terminates.

The assembly language isn't that complex and the source files for the shell are well commented so you should be able to figure it out and write a simple application.


# Why?

I have an insatiable itch to scratch, I love the retro look and feel of old terminals, maybe it's nostalgia and my love for movies like Wargames.

System16 is just a proof of concept - I wanted to know how feasible it was, the requirements aren't so demanding - I want something simple, speed isn't a requirement, I wanted it to look and feel old skool!

It's safe to say it's entirely feasible, not only did it work well it surpassed my expectations - I had to increase the timeslice to get the staggered output effect, it was lightning quick! I want that slow, scrolling effect...I even went as far as to add a subtle flickering effect with a simple CSS animation to give it that CRT sort of feel.

So yeah, concept proven - this is going to be part of a much larger project, for now this demo will remain here for anyone to mess about with, if you want to play with it do as you please!

Michael.
