import React, { useEffect } from 'react';
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function PaypalButtons({ order }) {
  return (
    <PayPalScriptProvider
      options={{
       // 'client-id': 'AeNsVcRMbAEQ2nyO8bRg-iPyy1Ov-FjYhTK3KmYffM1YxUv5dMQoajynuLleqhZedpF2CPkB1Q3Y7k0I'
        'client-id':'AfLQee3eJHabEDdrXc3JBpp0pplAHwoYZtNk2pD7Ix0pc0ZfCvcZnrNABPDr8z3hR5FnQwD5vHYXu89U'
      }}
    >
      <Buttons order={order} />
    </PayPalScriptProvider>
  );
}

function Buttons({ order }) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [{ isPending }] = usePayPalScriptReducer();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isPending) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isPending, showLoading, hideLoading]);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: order.totalPrice
          }
        }
      ]
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const payment = await actions.order.capture();
      const orderId = await pay(payment.id);
      clearCart();
      toast.success('Payment Saved Successfully', 'Success');
      navigate('/track/' + orderId);
    } catch (error) {
      toast.error('Payment Save Failed', 'Error');
    }
  };

  const onError = err => {
    toast.error('Payment Failed', 'Error');
  };

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    />
  );
}
