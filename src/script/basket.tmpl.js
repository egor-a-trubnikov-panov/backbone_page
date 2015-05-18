module.exports = function (btr, _) {
  btr.match("basket", function (ctx) {

    var
      array = [{
        elem: "title"
      }],
      collection = ctx.getParam("content"),
      price = 0,
      blockName = ctx.getBlockName();

    if (collection) {
      _.each(collection, function (item) {
        array.push({elem: "product", name: item.name, id: item.id});
        price += item.price;
      })
    }

    array.push({elem: "price", price: price});
    array.push({elem: "clear"});

    ctx.setContent(array);

    btr.match(blockName + "__title", function (ctx) {
      ctx.setContent("Список желаемого");
    });

    btr.match(blockName + "__product", function (ctx) {
      ctx.setAttr("data-id", ctx.getParam("id"));
      ctx.setContent([ctx.getParam("name"),{elem: "remove"}]);
    });

    btr.match(blockName + "__price", function (ctx) {
      ctx.setTag("span");
      ctx.setContent(["Сумма: ",{elem: "count", count: ctx.getParam("price") }, " руб."]);
    });
    btr.match(blockName + "__count", function (ctx) {
      ctx.setTag("span");
      ctx.setContent(ctx.getParam("count"));
    });

    btr.match(blockName + "__clear", function (ctx) {
      ctx.setContent("Очистить список");
    });
    btr.match(blockName + "__remove", function (ctx) {});


  })
};