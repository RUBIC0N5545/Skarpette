import CheckoutOrderMain from "../../Components/CheckoutOrder/CheckoutOrderMain";
import CheckoutOrderPhone from "../../Components/CheckoutOrder/CheckoutOrderPhone";
import CheckoutPayment from "../../Components/CheckoutPayment/CheckoutPayment";
import CheckoutReceiver from "../../Components/CheckoutReceiver/CheckoutReceiver";
import ContactInfo from "../../Components/ContactInfo/ContactInfo";
import Delivery from "../../Components/Delivery/Delivery";
import arrowLeft from '../../Components/assets/img/icons/arrow-left.svg';
import logo from '../../Components/assets/img/icons/logo-green.svg';

import { useCartItems } from "../../Context/CartContext";
import "./Checkout.scss";
import { useRef, useState } from "react";
import FooterMinorInfo from "../../Components/Footer/FooterMinorInfo";

interface ContactInfoRef {
  isValid: () => boolean;
  getName: () => string;
  getSurname: () => string;
  getPhone: () => string;
  getMail: () => string;
}

interface ReceiverInfoRef {
  isValid: () => boolean;
  getName: () => string;
  getSurname: () => string;
  getPhone: () => string;
}

interface DeliveryRef {
  isValid: () => boolean;
  getCity: () => string;
  getBuilding: () => string;
  getFlat: () => string;
  getWarehouseUkrPost: () => string;
  getWarehouseNovaPost: () => string;
  getStreet: () => string;

}

const Checkout = () => {
  // #region CheckoutOrderRegion
  const { cartItems } = useCartItems();

  let newTotalPrice = 0;
  let newTotalDiscount = 0;

  for (const cartItem of cartItems) {
    try {
      if (cartItem) {
        const itemTotalPrice = +cartItem.count * (cartItem.price2 || cartItem.price);
        newTotalPrice += itemTotalPrice;

        if (cartItem.price2) {
          const discountForItem = +cartItem.count * (cartItem.price - cartItem.price2);
          newTotalDiscount += discountForItem;
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching item:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  }
  
  const totalPrice = parseFloat(newTotalPrice.toFixed(2));
  const totalDiscount = parseFloat(newTotalDiscount.toFixed(2));
  // #endregion

  const [selectedOption, setSelectedOption] = useState("self-receiver");
  const [selectedDeliveryType, setSelectedDeliveryType] =
    useState<string>("nova-poshta-office");
  let userData = {};
  let deliveryData = {};

  const contactInfoRef = useRef<ContactInfoRef>(null);
  const receiverInfoRef = useRef<ReceiverInfoRef>(null);
  const deliveryRef = useRef<DeliveryRef>(null);

  const handleCheckout = () => {
    let isValidContactInfo = false;
    let isValidReceiverInfo = false;
    let isValidDeliveryRef = false;
  
    if (contactInfoRef.current) {
      isValidContactInfo = contactInfoRef.current.isValid();
    }

    if (deliveryRef.current) {
      isValidDeliveryRef = deliveryRef.current.isValid();
    }
  
    if (selectedOption === 'another-receiver' && receiverInfoRef.current) {
      isValidReceiverInfo = receiverInfoRef.current.isValid();
    } else {
      isValidReceiverInfo = true;
    }


  
    if (isValidContactInfo && isValidReceiverInfo && isValidDeliveryRef) {
      if (selectedOption === 'self-receiver') {
        userData = {
          name: contactInfoRef.current?.getName(),
          surname: contactInfoRef.current?.getSurname(),
          mail: contactInfoRef.current?.getMail(),
          phone: contactInfoRef.current?.getPhone(),
        };
      } else {
        userData = {
          name: receiverInfoRef.current?.getName(),
          surname: receiverInfoRef.current?.getSurname(),
          mail: contactInfoRef.current?.getMail(),
          phone: receiverInfoRef.current?.getPhone(),
          payerName: contactInfoRef.current?.getName(),
          payerSurname: contactInfoRef.current?.getSurname(),
          payerPhone: contactInfoRef.current?.getPhone(),
        };
      }

      switch (selectedDeliveryType) {
        case 'nova-poshta-office':
          deliveryData = {
            deliveryType: "Відділення Нової Пошти",
            city: deliveryRef.current?.getCity(),
            warehouse: deliveryRef.current?.getWarehouseNovaPost(),
          }

          break;      
        case 'nova-poshta-courier':
          deliveryData = {
            deliveryType: "Кур'єр Нової Пошти",
            city: deliveryRef.current?.getCity(),
            street: deliveryRef.current?.getStreet(),
            building: deliveryRef.current?.getBuilding(),
            flat: deliveryRef.current?.getFlat(),
          }

          break;
        case 'nova-poshta-poshtamat':
          deliveryData = {
            deliveryType: "Поштомат Нової Пошти",
            city: deliveryRef.current?.getCity(),
            warehouse: deliveryRef.current?.getWarehouseNovaPost(),
          }

          break;
        case 'ukrposhta-office':
          deliveryData = {
            deliveryType: "Відділення Укрпошти",
            city: deliveryRef.current?.getCity(),
            warehouse: deliveryRef.current?.getWarehouseUkrPost(),
          }

          break;
        default:
          break;
      }

      if (
        !Object.values(userData).includes('') && 
        !Object.values(deliveryData).includes('')
      ) {
        postData();
        console.log('posted');
      } else {
        console.log('Заповніть усі поля');
      }
    } else {
      console.log('Форма не пройшла валідацію');
    }
  
    console.log('userData', userData);
    console.log('deliveryData', deliveryData);

  };
  

  const postData = async () => {
    try {
      const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItems,
          userData: userData,
          deliveryData: deliveryData
        }),
      });

      if (response.ok) {
        console.log('Дані успішно відправлені!');
      } else {
        console.error('Помилка при відправці даних');
      }
    } catch (error) {
      console.error('Сталася помилка:', error);
    }
  }

  return (
    <div className="checkout">
      <div className="checkout__header">
        <div className="checkout__header-info">
          <div className="checkout__header-title">Оформлення замовлення</div>
          <a href="/cart" className="checkout__header-back">
            <img src={arrowLeft} alt="arrowLeft" className="checkout__header-back-arrow" />
            <span className="checkout__header-back-text"> Назад до кошика</span>
          </a>
        </div>
        <img src={logo} alt="logo" className="checkout__header-logo" />
      </div>

      <div className="checkout__order">
        <CheckoutOrderMain 
          cartItems={cartItems}
          totalPrice={totalPrice}
          totalDiscount={totalDiscount}
        />
      </div>
      <div className="checkout__delivery">
        <ContactInfo 
          ref={contactInfoRef}
        />
        <Delivery 
          ref={deliveryRef}
          selectedDeliveryType={selectedDeliveryType}
          setSelectedDeliveryType={setSelectedDeliveryType}
        />
        <CheckoutPayment />
        <CheckoutReceiver 
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          ref={receiverInfoRef}
        />
        <CheckoutOrderPhone 
          totalPrice={totalPrice}
          totalDiscount={totalDiscount}
        />
      </div>

      <button className="checkout__button" onClick={handleCheckout}>
        Оплатити замовлення
      </button>

      <div className="checkout__footer">
        <FooterMinorInfo />

      </div>
    </div>
  );
};

export default Checkout;
