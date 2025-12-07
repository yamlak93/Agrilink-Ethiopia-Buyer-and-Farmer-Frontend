import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartIcon = () => {
  const { getCartTotal } = useCart();
  const { itemCount } = getCartTotal();
  const navigate = useNavigate();

  return (
    <div
      className="position-relative"
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/buyer/cart")}
    >
      <ShoppingCart size={24} className="text-success" />
      {itemCount > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{
            fontSize: "0.65rem",
            padding: "0.25em 0.5em",
          }}
        >
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
