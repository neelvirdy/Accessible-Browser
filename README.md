SYMba
==================
SYMba is a chrome extension that provides full web accessibility where a user's only input is just a single click of a button. 

This extension is intended to assist people with disabilities with accessing the internet.

This project is associated with the SpeakYourMind Foundation. More info at http://speakyourmindfoundation.org/.

Our extension will be hooked up with hardware made by the SpeakYourMind Foundation, connecting each of their client's method of communication to what our extension reads as "a single click of a button". This will enable people with disabilities, such as one client who is only capable of moving one eyebrow, to independently browse the internet.

To load the extension into chrome, visit the url chrome://extensions and check "Developer mode", then click "Load unpacked extension", and select the folder containing the project files.

The extension works on all pages whose url's are not in the form chrome://*/*. Some pages are too dynamic or are designed in certain ways that prevent the extension from working well. For example, the extension is not practical to use on a page like medium.com due to the design of the site. These sites typically require full user control of a mouse and keyboard in order. However, for sites like nytimes.org or cs.brown.edu, the extension works well.

The extension achieves its purpose through a concept called switch access. Switch access is the selection of one element from a list by cycling through the elements of the list with a timer, and having the user "flip a switch" to signify that the current element that the timer is selecting is the element that they wish to select. The extension utilizes switch access to allow the user to traverse the DOM structure of a web page, and therefore be able to select any element in any web page through the use of just a trigger mechanism.


Features:

The extension autoscrolls the page so that the highlighted element will always be visible, even if it initially starts out of the page's view.

The sidebar controls provide basic browser controls, including Home, Back, Forward, Refresh, and New Tab. Chrome does not give permissions to switch or close tabs, so the user's caretaker must switch and  close tabs for them.

The sidebar also gives control over the extension's behavior. The sidebar includes Up a Level, Top Level, Leave, and Pause controls. 

Up a Level and Top Level change the level in which the user is traversing the DOM structure of the page. So, if a user is traversing the elements of a list and uses Up a Level, the list itself will become an option, along with its sibling in the tree DOM structure. Top Level simply brings the user to the top of the tree DOM structure, which is the body of the HTML. 

Leave allows the user to leave the sidebar controls without commiting to any of the operations. 

Pause allows the user to pause the cycling and highlighting of the extension and simply view the page content. To unpause, the user simply triggers their "click" mechanism.

When a user selects an element at the lowest level of the DOM structure, the extension allows the user a set amount of time to confirm the selection before acting on the element. The user confirms with his or her trigger mechanism. If the user does not confirm in the set amount of time, which is customizable by the user's caretaker, then the element will not be selected or acted on and the extension will continue from where it left off.

The cycling speed, scroll speed, and confirmation time are all customizable by the caretaker as constants at the top of the content.js file.


Bugs:

Scroll feature can create unexpected and unwanted movement of the screen on uniquely styled pages, such as facebook.com when trying to access a message window.

When some types of elements are given certain styling (i.e. box-shadow and/or background-color to indicate options for selection), the styling is not visible. In some cases this could be due to how HTML5 is built, or in other cases it could be due to the page's own styling overriding ours.

If a clickable element is not a simple button, input, or link, it loses functionality due to our extensions code interfering with the page's code in dynamically handling some click events. For example, on gmail.com, selecting a piece of mail will not open it.