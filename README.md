Cache Visualizations
====================

Final project for CS351.

Specifications
==============
20 points: Slide deck (same rules as your classmates, except you may have
slightly more slides if you choose)

80 points: Functionality and additional documentation
Documentation:
- A README suitable for future CS 351 students who want to use this tool.

*Functionality:*
==================

Build a web-based application that allows the user to specify the
following for an arbitrary number of cache levels:
* Total size of cache
* Block size (1, 2, or 4) <-- ideally an arbitrary power of 2, though
* Direct or 2-way set associative mapping <-- higher associativity, up to
full, is a bonus
* (bonus) Write policy
* (bonus) Access time (and access time for main memory)

The application should then provide a visualization of each cache's
organization, including metadata such as the valid bit, tag, LRU, and
dirty bit (if write-back is implemented). Index bits for each block should
be clearly shown.

The user should then be able to specify a sequence of memory references,
step through each one, and visualize the changes to the state of each
cache. The simulation should show the hit rate of each cache. If the
access time feature is implemented, the simulation should also show the
average memory access time for this sequence of requests.

Useage
======
On the initial launch of the simulator you will be presented with a single-level setup with only a L1 cache.
The left column allows you to configure the simulator:
* Address Sequence: Defines a sequence of memory addresses. You can define multiple addresses ( EX: 1, 20, 13 ) using space delimited values.
* Process Address Button: Will take the left-most address in the Address Sequence and process it with the given cache.
* Repeat Addresses and Repeat Speed: Will repeat the address sequence provided. After each address is processed the address will be placed on the end of the address sequence. This allows you to run a sequence of addresses continuously. The Repeat Speed slider controls how fast the simulator will process the addresses [ 1ms - 1000ms ]


