

export const EFoodCateogry = {
    DEFAULT : "default",
    FAST_FOOD : "fast-food",
    PIZA_FOOD : "piza-food",
    CAFE_DESSERT_FOOD : "cafe-dessert-food",
    CHINSE_FOOD : "chinse-food",
    SOUP_FOOD : "soup-food",
    RICE_FOOD : "rice-food",
    WESTERN_FOOD : "western-food",
    MEAT_FOOD : "meat-food"
}

export function getCategoryItem(param = "buyer"){
    let data = [];

    if(param === "buyer"){
        data.push( { 
            category : EFoodCateogry.DEFAULT,
            x : -538,
            y : -25,
            title : "아무거나" }
        );
    }

    data.push( { 
        category : EFoodCateogry.FAST_FOOD,
        x : -27,
        y : -22,
        title : "패스트푸드" }
    );

    data.push( { 
        category : EFoodCateogry.PIZA_FOOD,
        x : -140,
        y : -27,
        title : "피자" }
    );

    data.push( { 
        category : EFoodCateogry.CAFE_DESSERT_FOOD,
        x : -429,
        y : -140,
        title : "카페, 디저트" }
    );

    data.push( { 
        category : EFoodCateogry.CHINSE_FOOD,
        x : -309,
        y : -86,
        title : "중식" }
    );

    data.push( { 
        category : EFoodCateogry.SOUP_FOOD,
        x : -313,
        y : -136,
        title : "찜, 탕" }
    );

    data.push( { 
        category : EFoodCateogry.RICE_FOOD,
        x : -369,
        y : -198,
        title : "백반" }
    );

    data.push( { 
        category : EFoodCateogry.WESTERN_FOOD,
        x : -369,
        y : -254,
        title : "양식" }
    );

    data.push( { 
        category : EFoodCateogry.MEAT_FOOD,
        x : -140,
        y : -141,
        title : "고기" }
    );

    return data;
}