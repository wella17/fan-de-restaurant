const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send order confirmation email
const sendOrderConfirmation = async (order) => {
  try {
    const transporter = createTransporter();

    let emailContent = '';

    if (order.paymentMethod === 'zelle') {
      emailContent = `
        <h2>Order Confirmation - Payment Required</h2>
        <p>Dear ${order.customerInfo.fullName},</p>

        <p>Thank you for your order! Your order #${order.orderNumber} has been received and is pending payment.</p>

        <div style="background-color: #fee2e2; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #dc2626; margin: 0 0 10px 0;">Payment Required via Zelle</h3>
          <p style="margin: 5px 0;"><strong>Send payment to:</strong> ${process.env.ZELLE_EMAIL || process.env.ZELLE_PHONE}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> $${order.total}</p>
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Please include your order number in the Zelle memo.</p>
        </div>

        <h3>Order Details:</h3>
        <ul>
          ${order.items.map(item => `<li>${item.name} x${item.qty} - $${item.price * item.qty}</li>`).join('')}
        </ul>

        <p><strong>Subtotal:</strong> $${order.subtotal}</p>
        ${order.deliveryFee > 0 ? `<p><strong>Delivery Fee:</strong> $${order.deliveryFee}</p>` : ''}
        <p><strong>Total:</strong> $${order.total}</p>

        <p><strong>Order Type:</strong> ${order.orderType}</p>
        <p><strong>Time:</strong> ${order.pickup}</p>

        ${order.orderType === 'delivery' ? `
          <h3>Delivery Address:</h3>
          <p>
            ${order.customerInfo.address}<br>
            ${order.customerInfo.apartment ? order.customerInfo.apartment + '<br>' : ''}
            ${order.customerInfo.city}, ${order.customerInfo.state} ${order.zip}
          </p>
          ${order.customerInfo.deliveryInstructions ? `<p><strong>Instructions:</strong> ${order.customerInfo.deliveryInstructions}</p>` : ''}
        ` : ''}

        <p>We'll begin preparing your order once payment is received. Thank you for choosing Fan de!</p>

        <p>Best regards,<br>Fan de Team</p>
      `;
    } else {
      emailContent = `
        <h2>Order Confirmation</h2>
        <p>Dear ${order.customerInfo.fullName},</p>

        <p>Thank you for your order! Your order #${order.orderNumber} has been confirmed.</p>

        <h3>Order Details:</h3>
        <ul>
          ${order.items.map(item => `<li>${item.name} x${item.qty} - $${item.price * item.qty}</li>`).join('')}
        </ul>

        <p><strong>Subtotal:</strong> $${order.subtotal}</p>
        ${order.deliveryFee > 0 ? `<p><strong>Delivery Fee:</strong> $${order.deliveryFee}</p>` : ''}
        <p><strong>Total:</strong> $${order.total}</p>

        <p><strong>Order Type:</strong> ${order.orderType}</p>
        <p><strong>Time:</strong> ${order.pickup}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

        ${order.orderType === 'delivery' ? `
          <h3>Delivery Address:</h3>
          <p>
            ${order.customerInfo.address}<br>
            ${order.customerInfo.apartment ? order.customerInfo.apartment + '<br>' : ''}
            ${order.customerInfo.city}, ${order.customerInfo.state} ${order.zip}
          </p>
          ${order.customerInfo.deliveryInstructions ? `<p><strong>Instructions:</strong> ${order.customerInfo.deliveryInstructions}</p>` : ''}
        ` : ''}

        ${order.customerInfo.orderNotes ? `<p><strong>Order Notes:</strong> ${order.customerInfo.orderNotes}</p>` : ''}

        <p>We're preparing your order and will have it ready for you soon!</p>

        <p>Best regards,<br>Fan de Team</p>
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: order.customerInfo.email,
      subject: `Order Confirmation #${order.orderNumber} - Fan de`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${order.customerInfo.email}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Send order status update email
const sendOrderStatusUpdate = async (order, newStatus) => {
  try {
    const transporter = createTransporter();

    let statusMessage = '';
    switch (newStatus) {
      case 'confirmed':
        statusMessage = 'Your order has been confirmed and we\'re starting to prepare it.';
        break;
      case 'preparing':
        statusMessage = 'Your order is now being prepared in our kitchen.';
        break;
      case 'ready':
        statusMessage = order.orderType === 'pickup'
          ? 'Your order is ready for pickup!'
          : 'Your order is ready and will be delivered soon!';
        break;
      case 'completed':
        statusMessage = 'Your order has been completed. Thank you for choosing Fan de!';
        break;
      case 'cancelled':
        statusMessage = 'Your order has been cancelled. If you have any questions, please contact us.';
        break;
      default:
        statusMessage = `Your order status has been updated to: ${newStatus}`;
    }

    const emailContent = `
      <h2>Order Status Update</h2>
      <p>Dear ${order.customerInfo.fullName},</p>

      <p><strong>Order #${order.orderNumber}</strong></p>

      <div style="background-color: #dbeafe; padding: 15px; margin: 20px 0; border-radius: 8px;">
        <h3 style="color: #1d4ed8; margin: 0 0 10px 0;">Status Update</h3>
        <p style="margin: 0; font-size: 16px;">${statusMessage}</p>
      </div>

      <p><strong>Order Type:</strong> ${order.orderType}</p>
      <p><strong>Time:</strong> ${order.pickup}</p>

      <p>Thank you for your business!</p>

      <p>Best regards,<br>Fan de Restaurant Team</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: order.customerInfo.email,
      subject: `Order Update #${order.orderNumber} - Fan de`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${order.customerInfo.email}`);
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendOrderStatusUpdate
};