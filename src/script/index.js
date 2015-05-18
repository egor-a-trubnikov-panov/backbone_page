var
  btr = new (require('btr')).BTR(),
  $ = require('jquery'),
  ui = require('./jquery-ui-custom.js')($),
  _ = require('underscore'),
  Bb = require('backbone'),
  fastdom = require('fastdom'),
  vDOM = require('vdom')($, fastdom, btr),
  basketTmpl = require('./basket.tmpl')(btr, _),
  productsTmpl = require('./products.tmpl')(btr, _);


function support_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

var App = {
  Models: {},
  Collections: {},
  Views: {}
};

App.Models.Product = Bb.Model.extend({
  initialize: function () {
    this.on("change", function () {
      poductView.render();
      backetView.render();
    });
  },
  defaults: {
    "name": 'игра',
    "price": 0,
    "cover": 'url',
    "id": 0,
    "added": false
  }
});

App.Collections.Products = Bb.Collection.extend({
  model: App.Models.Product
});

App.Collections.Backet = Bb.Collection.extend({});


App.Views.Products = Bb.View.extend({
  el: ".products",

  events: {
    "click .products__button": "addToBasket"
  },

  render: function () {
    var
      self = this,
      json = {
        block: "products",
        content: self.collection.toJSON()
      };

    self.diff(json);
    fastdom.write(function () {
      self.draggable();
    });
    return self;
  },

  diff: diff,

  cashe: {},

  draggable: function () {
    this.$el.find(".products__product").draggable({
      cursor: 'move',
      revert: true
    });
  },

  addToBasket: function (event) {
    modelEdit("products", event);
  }
});


App.Views.Backet = Bb.View.extend({
  el: ".basket",

  events: {
    "click .basket__remove": "removeProduct",
    "click .basket__clear": "removeAllProduct"
  },

  render: function () {
    var
      json = {
        block: "basket",
        content: this.collection.toJSON()
      };

    this.diff(json);
    this.droppable();
    return this;
  },

  diff: diff,

  cashe: {},

  droppable: function () {
    var self = this;
    self.$el
      .droppable({
        drop: function (event, ui) {
          var
            id = ui.draggable.data("id"),
            model = products.get(id);
          productsToBasket.add(model);
          model.set("added", true);
          setStorage();
        }
      });
  },

  removeProduct: function (event) {
    modelEdit("basket", event);
  },
  removeAllProduct: function () {
    productsToBasket.each(function (model) {
      model.set("added", false);
    }, productsToBasket);
    productsToBasket.reset();
    setStorage();
    this.render();
  }
});


function modelEdit(name, event) {
  var
    id = $(event.currentTarget)
      .parent("." + name + "__product")
      .data("id"),
    model = products.get(id);

  if (productsToBasket.get(id)) {
    productsToBasket.remove(model);
    model.set("added", false);
    setStorage();
  } else {
    productsToBasket.add(model);
    model.set("added", true);
    setStorage();
  }
}

function setStorage() {
  if (support_storage()) {
    localStorage.setItem("products", JSON.stringify(productsToBasket.toJSON()));
  }
}

function diff(json) {
  this.cashe = vDOM.diff(this.$el, this.cashe, btr.setUniq(btr.processBtrJson(json)));
}

var
  products = new App.Collections.Products(),
  productsToBasket = new App.Collections.Products(),
  poductView = new App.Views.Products({collection: products}),
  backetView = new App.Views.Backet({collection: productsToBasket});

$.ajax({
  url: "/products.json"
}).done(function (data) {
  var
    array = _.map(data, function (item, id) {
      return _.extend(item, {"id": id - 1});
    });

  if (support_storage()) {
    var storage = JSON.parse(localStorage.getItem("products"));
    products.set(_.extend(array, storage));
    products.each(function (item) {
      if (item.toJSON().added) {
        productsToBasket.add(item);
      }
    }, products);

  } else {
    products.set(array);
  }

  poductView.render();
  backetView.render();
});