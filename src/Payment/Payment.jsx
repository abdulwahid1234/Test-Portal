import React, { useState } from "react";
import "./Payment.css";

const Payment = () => {
  // Form states
  const [email, setEmail] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [method, setMethod] = useState("paypal");

  // Dummy order summary data
  const products = [
    {
      title: "Payment Portal",
      name: "",
      img: "https://thumbs.dreamstime.com/b/portrait-beautiful-african-girl-20607434.jpg"
    }
    // {
    //   title: "#4601",
    //   name: "Silver color sleek productive laptop",
    //   price: "00,00$",
    //   img: "https://cdn.pixabay.com/photo/2016/11/29/09/32/camera-1867184_1280.jpg"
    // },
    // {
    //   title: "#4601",
    //   name: "Silver color sleek productive laptop",
    //   price: "00,00$",
    //   img: "https://cdn.pixabay.com/photo/2016/11/23/00/41/microphone-1851517_1280.jpg"
    // },
    // {
    //   title: "#4601",
    //   name: "Silver color sleek productive laptop",
    //   price: "00,00$",
    //   img: "https://cdn.pixabay.com/photo/2015/01/21/14/14/apple-606761_1280.jpg"
    // }
  ];

  return (
    <div className="payment-root">
      <div className="payment-main">
        {/* Progress Bar */}
        <div className="payment-steps">
          <div className="step active">
            <div className="circle checked">&#10003;</div>
            <span>SHIPPING DETAILS</span>
          </div>
          <div className="line active"></div>
          <div className="step active">
            <div className="circle active"></div>
            <span>PAYMENT</span>
          </div>
          <div className="line"></div>
          <div className="step">
            <div className="circle"></div>
            <span>CONFIRMATION</span>
          </div>
        </div>

        <h2 className="payment-title">ENTER YOUR PAYMENT INFORMATION</h2>

        {/* Payment methods */}
        <div className="pay-methods">
          <button
            className={method === "Easypaisa" ? "pay-btn active" : "pay-btn"}
            onClick={() => setMethod("Easypaisa")}
            type="button"
          >
            <img src="https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png" alt="Easypaisa" height={40} />
          </button>
          <button
            className={method === "mastercard" ? "pay-btn active" : "pay-btn"}
            onClick={() => setMethod("mastercard")}
            type="button"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="mastercard" height={40} />
          </button>
          <button
            className={method === "visa" ? "pay-btn active" : "pay-btn"}
            onClick={() => setMethod("visa")}
            type="button"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" height={40} />
          </button>
        </div>

        {/* Form */}
        <form className="payment-form">
          <div className="input-row">
            <div className="input-group">
              <label>Email Address <span>*</span></label>
              <input
                type="email"
                placeholder="nuruzzaman.uxui.bd@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Card Holder <span>*</span></label>
              <input
                type="text"
                placeholder="Jane Cooper"
                value={cardHolder}
                onChange={e => setCardHolder(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Card Number <span>*</span></label>
            <input
              type="text"
              placeholder="4356 | XXXX XXXX XXXX"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
                maxLength={19}
                required
              />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Expiration Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                maxLength={5}
                required
              />
            </div>
            <div className="input-group">
              <label>CVV <span>*</span></label>
              <input
                type="password"
                placeholder="###"
                value={cvv}
                onChange={e => setCvv(e.target.value)}
                maxLength={4}
                required
              />
            </div>
          </div>

          <button className="payment-submit-btn" type="submit">
            Confirm Payment
          </button>
        </form>
      </div>


      <div className="payment-sidebar">
        <h3></h3>
        <div className="summary-list">
          <div className="summary-row">
            <span>Test portal</span>
            <span>Akbar Write Something Here!</span>
          </div>
          <div className="summary-row">
            <span>Summary</span>
            <span>......</span>
          </div>
          <div className="summary-row">
            <span>Total amount</span>
            <span>00,00$</span>
          </div>
          {/* <div className="summary-row">
            <span>Delivery date</span>
            <span>22/01/2025</span>
          </div> */}
        </div>
        <div className="summary-products">
          {products.map((item, idx) => (
            <div className="summary-product" key={idx}>
              <img src={item.img} alt={item.name} />
              <div>
                <div className="summary-prod-title">{item.name}</div>
                <div className="summary-prod-info">
                  Product ID: {item.title}<br />
                  {/* Quantity: 1<br /> */}
                  {/* Unit price: {item.price}<br /> */}
                  Total price: {item.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payment;
