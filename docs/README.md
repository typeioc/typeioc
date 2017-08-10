TypeIOC
=======
Dependency injection container for typescript / javascript.

[![npm version](https://badge.fury.io/js/typeioc.svg)](https://badge.fury.io/js/typeioc)


The idea of dependency injection is not new and TypeIOC is not trying to reinvent the wheel. But it was rather written with one idea in mind - simplicity, think fancy hash table.
How to use it is, well up to the user. One way would be to go full SOLID principles and effectively manage class dependencies. Another way is more functional and requires techniques like factories and functional composition. Whichever way is chosen, TypeIOC can help.

<br/>
So what is it used for?

*   Dependencies management
*   Component lifecycle management
*   Component behaviour manipulation.
*   Syntactic sugar / type checking if used with typescript


How do we use it?

*   Create a container builder instance
*   Register all the required services as components/dependencies
*   Create container instance
*   Resolve services as needed

<br/>
But to start with, let's install it first:

### Installation
npm install --save typeioc
<br/>(yarn wokrs as well)


### Changes
[Github releases page](https://github.com/maxgherman/TypeIOC/releases)