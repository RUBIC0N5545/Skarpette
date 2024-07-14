import React from "react";

import "./MainPageListGoods.scss";
import chevron from "../assets/img/icons/chevron-right.svg";
import Item from "../Item/Item";
import image from "../assets/img/velo_rezym_01.png";


interface Props {
  title: string;
  catalogButton?: boolean;
}

const MainPageListGoods: React.FC<Props> = ({ title, catalogButton = false }) => {
  return (
    <div className="list-goods">
      <div className="list-goods__container">
        <div className="list-goods__head">
          <div className="list-goods__title">{title}</div>
          <a href="/catalog" className="list-goods__button">
            {catalogButton && 
              <img
                className="list-goods__mob-button"
                src={chevron}
                alt="button img"
              />
            }
            {catalogButton && <div className="list-goods__tablet-button">Подивитись всі</div>}
          </a>
        </div>

        <div className="list-goods__goods-list">
          <Item
            image={image}
            category="Жіночі"
            name="Велопара Режим Польоту"
            new_price={100}
            old_price={120}
          />

          <Item
            image={image}
            category="Жіночі"
            name="Велопара Режим Польоту"
            new_price={100}
            old_price={120}
          />

          <Item
            image={image}
            category="Жіночі"
            name="Велопара Режим Польоту"
            new_price={100}
            old_price={120}
          />

          <Item
            image={image}
            category="Жіночі"
            name="Велопара Режим Польоту"
            new_price={100}
            old_price={120}
          />
        </div>
      </div>
    </div>
  );
};

export default MainPageListGoods;
