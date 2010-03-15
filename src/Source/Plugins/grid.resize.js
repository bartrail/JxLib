// $Id$
/**
 * Class: Jx.Plugin.Resize
 *
 * Extends: <Jx.Plugin>
 *
 * Grid plugin to enable dynamic resizing of column width and row height
 *
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Resize = new Class({

    Extends : Jx.Plugin,

    options: {
        /**
         * Option: column
         * set to true to make column widths resizeable
         */
        column: false,
        /**
         * Option: row
         * set to true to make row heights resizeable
         */
        row: false,
        /**
         * Option: tooltip
         * the tooltip to display for the draggable portion of the
         * cell header
         */
        tooltip: 'Drag to resize, double click to auto-size.'
    },
    /**
     * Property: els
     * the DOM elements by which the rows/columns are resized.
     */
    els: {
      column: [],
      row: []
    },

    /**
     * Property: drags
     * the Drag instances
     */
    drags: {
      column: [],
      row: []
    },

    /**
     * Property: bound
     * storage for bound methods useful for working with events
     */
    bound: {},
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
        this.parent();
        this.bound.createResizeHandles = this.createResizeHandles.bind(this);
        this.bound.removeResizeHandles = this.removeResizeHandles.bind(this);
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and connects it to the grid
     */
    attach: function (grid) {
        if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
            return;
        }
        this.grid = grid;
        this.grid.addEvent('doneCreateGrid', this.bound.createResizeHandles);
        this.grid.addEvent('beginCreateGrid', this.bound.removeResizeHandles);
        this.createResizeHandles();
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        if (this.grid) {
            this.grid.removeEvent('doneCreateGrid', this.bound.createResizeHandles);
            this.grid.removeEvent('beginCreateGrid', this.bound.removeResizeHandles);
        }
        this.grid = null;
    },

    activate: function(option) {
        if ($defined(this.options[option])) {
          this.options[option] = true;
        }
        this.createResizeHandles();
    },
    
    deactivate: function(option) {
        if ($defined(this.options[option])) {
          this.options[option] = false;
        }
        this.createResizeHandles();
    },
    
    removeResizeHandles: function() {
        ['column','row'].each(function(option) {
          this.els[option].each(function(el) { el.dispose(); } );
          this.els[option] = [];
          this.drags[option].each(function(drag){ drag.detach(); });
          this.drags[option] = [];
        }, this);
    },

    createResizeHandles: function() {
        this.removeResizeHandles();
        if (this.options.column && this.grid.columns.useHeaders()) {
            this.grid.columns.columns.each(function(col, idx) {
                if (col.header) {
                    var el = new Element('div', {
                        'class':'jxGridColumnResize',
                        title: this.options.tooltip,
                        events: {
                            dblclick: function() {
                                col.options.width = 'auto';
                                col.setWidth(col.getWidth(true));
                            }
                        }
                    }).inject(col.header);
                    this.els.column.push(el);
                    this.drags.column.push(new Drag(el, {
                        limit: {y:[0,0]},
                        onDrag: function(el) {
                            var w = el.getPosition(el.parentNode).x.toInt();
                            col.setWidth(w);
                        }
                    }));
                }
            }, this);
        }

        //if (this.options.row && this.grid.row.useHeaders()) {}
    }
});