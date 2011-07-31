/*
---

name: Jx.Plugin.Tree.Sortable

description: A plugin that will enable drag and drop sorting in a Jx.Tree

license: MIT-style license.

requires:
 - Jx.Tree
 - Jx.Plugin.Tree

optional:
 - 

provides: [Jx.Plugin.Tree.Sortable]

images:
 - 

...
 */
/**
 * Class: Jx.Plugin.Tree.Sortable
 * 
 * 
 * Much of this code has been adapted from 
 * https://raw.github.com/cpojer/mootools-tree/master/Source/Tree.js
 * which is under an MIT-style license
 */
Jx.Plugin.Tree.Sortable = new Class({

    Extends: Jx.Plugin,
    Family: 'Jx.Plugin.Tree.Sortable',
    
    options: {
        indicatorOffset: 0,
        cloneOffset: {x: 16, y: 16},
		cloneOpacity: 0.8,
		checkDrag: Function.from(true),
		checkDrop: Function.from(true),
        precalculate: false
    },
    
    tree: null,
    indicator: null,
    
    init: function () {
        this.indicator = new Element('div.jxTreeIndicator');

		var self = this;
		this.handler = function(e){
			self.mousedown(this, e);
		};
        
        this.bound = {
            mousedown: this.mousedown.bind(this),
            mouseup: this.mouseup.bind(this),
            onLeave: this.onLeave.bind(this),
            onDrag: this.onDrag.bind(this),
            onDrop: this.onDrop.bind(this)
        };
    },

    attach: function (tree) {
        if (tree === undefined || tree === null || !(tree instanceof Jx.Tree)) {
            return;
        }
        
        this.tree = tree;
        this.element = document.id(this.tree);
        
        this.tree.addEvent('mousedown', this.bound.mousedown);
        document.addEvent('mouseup', this.bound.mouseup);
        this.parent();
    },
    
    detach: function () {
        this.tree.removeEvent('mousedown', this.bound.mousedown);
        document.removeEvent('mouseup', this.bound.mouseup);
        this.parent();
    },
    
    mousedown: function(item, tree) {
        element = document.id(item);
        
        //tell the tree to hold firing all events
        this.tree.setHoldEvents(true);
        
        this.padding = (this.element.getElement('li ul li') || this.element.getElement('li')).getLeft() - this.element.getLeft() + this.options.indicatorOffset;
		
		if(!this.options.checkDrag.call(this, element)) return;
		//if (this.collapse && Slick.match(event.target, this.collapse.options.selector)) return;

		this.current = element;
		this.clone = element.clone().setStyles({
			left: event.page.x + this.options.cloneOffset.x,
			top: event.page.y + this.options.cloneOffset.y,
			opacity: this.options.cloneOpacity
		}).addClass('jxTreeDrag').inject(document.body); //should this be the container instead?

		this.clone.makeDraggable({
			droppables: this.element.getElements('li a'),
            container: document.id(this.tree),
            precalculate: this.options.precalculate,
			onLeave: this.bound.onLeave,
			onEnter: this.bound.onEnter,
			onDrop: this.bound.onDrop
		}).start(event);
    },
    
    mouseup: function() {
        if (this.clone) this.close.destroy();
    },
    
    onEnter: function(el, droppable){
        droppable.addClass('jxTreeDropActive');
        
        //wait a second and then open the branch if collapsed
        
	},

	onDrop: function(el, droppable, event){
		//get the jx.widget objects for el and droppable
        var moved = $jx(el),
            previous = $jx(droppable);
        //kill the clone
        this.clone.destroy();
        //move the original from it's current location to this one
        moved.owner.remove(moved);
        previous.owner.add(moved,previous);
        //fire the event [the element we moved, the new previous element (droppable), and the tree instance
		this.fireEvent('jxTreeSortDrop', [moved, previous, this.tree]);
	},
    
    onLeave: function(el, droppable) {
        droppable.removeClass('jxTreeDropActive');
    }
    
});