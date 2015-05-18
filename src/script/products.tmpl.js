module.exports = function (btr, _) {

  btr.match("products", function (ctx) {
    var content = ctx.getParam("content"),
      blockName = ctx.getBlockName();

    ctx.setContent(_.map(content, function (item) {
      return _.extend(item,{elem: "product"})
    }));




    btr.match(blockName + "__product", function (ctx) {
      ctx.setAttr("data-id", ctx.getParam("id"));
      ctx.setContent([
          {
            elem: "picture",
            url: ctx.getParam("cover")
          },
          {
            elem: "button",
            state: ctx.getParam("added")
          },
          {
            elem: "name",
            name: ctx.getParam("name")
          },
          {
            elem: "price",
            price: ctx.getParam("price")
          }
        ]
      );

    });


    btr.match(blockName + "__picture", function (ctx) {
      ctx.setTag("img");
      ctx.setAttr("src", ctx.getParam("url"));
    });

    btr.match(blockName + "__button", function (ctx) {
      if (ctx.getParam("state")) {
        ctx.setState("added", true);
        ctx.setContent("В списке");
      } else {
        ctx.setState("added", false);
        ctx.setContent("Добавить");
      }
      ctx.setTag("button");
    });

    btr.match(blockName + "__name", function (ctx) {
      ctx.setTag("h4");
      ctx.setContent(ctx.getParam("name"));
    });

    btr.match(blockName + "__price", function (ctx) {
      ctx.setTag("span");
      ctx.setContent(ctx.getParam("price") + " руб.");
    });


  });
};
