import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import axios from "../Components/Axios";

const Order = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [form] = Form.useForm();

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/order");
      setData(response.data.data.doc);
    } catch (error) {
      // console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (record) => {
    setCurrentOrder(record);
    form.setFieldsValue({
      ...record,
      colorName: record.products?.[0]?.option?.variant?.colorName || "",
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/order/${id}`);
      message.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      message.error("Failed to delete order");
      // console.error("Error deleting order:", error);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const updatedProducts = currentOrder.products.map((product) => {
        return {
          ...product,
          option: {
            ...product.option,
            variant: {
              ...product.option.variant,
              colorName: values.colorName,
            },
          },
        };
      });

      await axios.patch(`/order/${currentOrder?._id}`, {
        ...values,
        products: updatedProducts,
      });

      message.success("Order updated successfully");
      setIsModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order");
      // console.error("Error updating order:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`/order/${orderId}`, { orderStatus: newStatus });
      message.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order status");
      // console.error("Error updating order status:", error);
    }
  };

  const handleCourierChange = async (order, courier) => {
    if (courier === "Steadfast") {
      try {
        const { name, phone, streetAddress, city, zone, area, totalCost } =
          order;
        const invoice = `${order._id}`;

        const payload = {
          invoice,
          recipient_name: name,
          recipient_phone: phone,
          recipient_address: `${streetAddress}, ${area?.areaName}, ${city?.cityName}, ${zone?.zoneName} `,
          cod_amount: totalCost,
        };

        const response = await axios.post(
          "https://portal.packzy.com/api/v1/create_order",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "Api-Key": "pishkbxd7bsoooxowldzwgbxbwxam2xk",
              "Secret-Key": "eb2isuxnxvnvhoyn55el4jbl",
            },
          }
        );

        if (response?.data?.status === 200) {
          return message.success("Order placed with Steadfast successfully");
        }
        if (response?.data?.status === 400) {
          return message.error(response?.data?.errors.invoice);
        }
      } catch (error) {
        message.error("Error placing order with Steadfast");
        // console.error("Error placing Steadfast order:", error);
      }
    }
    if (courier === "pathao") {
      try {
        const { name, phone, streetAddress, city, zone, area, totalCost } =
          order;

        const payload = {
          store_id: "208790",
          merchant_order_id: order._id,
          recipient_name: name,
          recipient_phone: phone,
          recipient_city: city?.cityID,
          recipient_zone: zone?.zoneID,
          delivery_type: 48,
          item_type: 2,
          item_quantity: order.products[0].quantity,
          item_weight: 0.5,
          amount_to_collect: totalCost,
          recipient_address: `${streetAddress}, ${area?.areaName}, ${city?.cityName}, ${zone?.zoneName} `,
        };

        const response = await axios.post(
          "https://api-hermes.pathao.com/aladdin/api/v1/orders",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              headers: {
                Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI2NzU3IiwianRpIjoiY2MxNjgwODA5NmQ0YTI1NjY4Y2RiZGQwZDA5OTNjZGFjNzcyZWEwZTFhNDEyOTJjMTJhMjliZmFmY2JlYzJlODUzZTZiZDQ2NTVhMTdiY2YiLCJpYXQiOjE3MjQ2NjU3OTQuMDU0MDY2LCJuYmYiOjE3MjQ2NjU3OTQuMDU0MDcsImV4cCI6MTczMjQ0MTc5My45NjgxNjgsInN1YiI6IjIyODM2NiIsInNjb3BlcyI6W119.ceuT-z6QujzVUinPCr2Bea4IA1h-QhL5goteDnT-NL2zXSBxnjrQ8CdTom_m6HR_u1D-aQ8bVdMCQN2j0B14bu20An9ofUXxE-UKx7CQxJITMhilxxxj0de8_qJqbXIWYx8cMwBkDrD21gBTpu9-3bh8qV9SJ40zwm2uYhWoYvA5WQBQetge1RZs0N9XVsKP3mfFdq1s_6MD8DXygQScNHuffHksjXb1VjsbxdA2kOIbS9D_REHV4pSlr8a86lGVkmjkOhc9NK646GenR-fk2tdsV-wXoSvm-M2Lb73t4A01Ww82L9iz_B3HkFmEaYXQv8DCJdgjCKt6bjgkH3WP1obrATJIQUOaUHIWVgTGgN9_yAvAdLGNpxqo7oj5asVXVRLXVNGufRgHDToJgw9tyupvPpFcTeYvn1gHY0WYga8JXTsWC--qsQ-OiK5_fpDcr0Nry9_RUyiqM95esYMeRUry5-PJ2Du4znVxc6DtFals4gsRX3vErJaYtWuX2Oj24ouHV4k4Rz2CeiV9Y5oHBLp2Ah5Wl0MtbLA7yzIV6p0me3Wzom_DY-dI0WpGPPn3_nizhU3JlU9mGIRqZi1mLpHY6X6RydcCW7VLQpsr9JxGOA73W5GnanZenxSQ_Pq6273XxxSSn0IzLSxSdVxgUxyf8T1Rroy0mWIH97Y67zc`,
              },
            },
          }
        );

        if (response?.data?.status === 200) {
          return message.success("Order placed with Steadfast successfully");
        }
        if (response?.data?.status === 400) {
          return message.error(response?.data?.errors.invoice);
        }
      } catch (error) {
        message.error("Error placing order with pathao");
        // console.error("Error placing pathao order:", error);
      }
    }
  };

  const handlePrintInvoice = async (order) => {
    try {
      const response = await axios.get(`/order/${order._id}`);
      const anOrder = response?.data?.data?.doc;

      const invoiceWindow = window.open("", "_blank");

      const invoiceHTML = `
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
              .invoice-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .invoice-header h1 { margin: 0; }
              .invoice-details { margin-bottom: 20px; }
              .invoice-details p { margin: 0; }
              .invoice-products { width: 100%; border-collapse: collapse; }
              .invoice-products th, .invoice-products td { border: 1px solid #eee; padding: 10px; }
              .invoice-total { margin-top: 20px; text-align: right; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="invoice-box">
              <div class="invoice-header">
                <h1>Invoice</h1>
                <div>
                  <p>Order ID: ${anOrder._id}</p>
                  <p>Date: ${new Date(
                    anOrder.createdAt
                  ).toLocaleDateString()}</p>
                </div>
              </div>
              <div class="invoice-details">
                <p>Name: ${anOrder.name}</p>
                <p>Phone: ${anOrder.phone}</p>
                <p>Email: ${anOrder.email}</p>
                
                <p>Address:${anOrder.streetAddress}, ${
        anOrder.area.areaName
      }, ${anOrder?.city?.cityName}, ${anOrder?.zone?.zoneName} </p>
              </div>
              <table class="invoice-products">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${anOrder.products
                    .map(
                      (product) => `
                      <tr>
                        <td>${product?.option?.product?.name || "N/A"}</td>
                        <td>${product?.option?.variant?.colorName || "N/A"}</td>
                        <td>${product?.option?.size || "N/A"}</td>
                        <td>${product?.quantity || "N/A"}</td>
                        <td>${anOrder.totalCost || "N/A"}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
              <div class="invoice-total">
                <p>Total Cost: ${anOrder.totalCost}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();

      invoiceWindow.onload = () => {
        invoiceWindow.print();
        invoiceWindow.close();
      };
    } catch (error) {
      // console.error("Error printing invoice:", error);
    }
  };

  const columns = [
    {
      title: "SR",
      dataIndex: "index",
      key: "sr",
      render: (text, record, index) => <a>{index + 1}</a>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Product Name",
      dataIndex: ["products", 0, "option", "product", "name"],
      key: "productName",
      render: (text) => <a>{text || "N/A"}</a>,
    },
    {
      title: "Price",
      dataIndex: "totalCost",
      key: "totalCost",
    },
    {
      title: "Quantity",
      dataIndex: ["products", 0, "quantity"],
      key: "quantity",
    },

    {
      title: "Color Name",
      dataIndex: ["products", 0, "option", "variant", "colorName"],
      key: "colorName",
    },
    {
      title: "Size",
      dataIndex: ["products", 0, "option", "size"],
      key: "size",
    },
    {
      title: "Information",
      dataIndex: "information",
      key: "information",
      render: (text, record) => (
        <div>
          <p>Name: {record.name}</p>
          <p>Phone: {record.phone}</p>
          <p>Email: {record.email}</p>
          <p>City: {record.city?.cityName}</p>
          <p>
            Address:
            {`${record?.streetAddress},${record?.zone?.zoneName}, ${record.area?.areaName}`}
          </p>
        </div>
      ),
    },
    {
      width: "10%",
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (_, record) => (
        <Select
          className="w-[100%]"
          value={record.orderStatus} // Show current status
          onChange={(value) => handleStatusChange(record._id, value)}
          options={[
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Delivered", value: "delivered" },
            { label: "Shipped", value: "shipped" },
            { label: "Canceled", value: "canceled" },
          ]}
        />
      ),
    },
    {
      width: "15%",
      title: "Courier Service",
      dataIndex: "courier",
      key: "courier",
      render: (text, record) => (
        <Select
          className="w-[100%]"
          value={record.courier || "Select Courier"} // Show selected courier
          onChange={(value) => handleCourierChange(record, value)}
          options={[
            { label: "Steadfast", value: "Steadfast" },
            { label: "pathao", value: "pathao" },
          ]}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="primary" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
          <Button type="primary" onClick={() => handlePrintInvoice(record)}>
            Print Invoice
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Edit Order"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={currentOrder}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city">
            <Input />
          </Form.Item>
          <Form.Item label="District" name="district">
            <Input />
          </Form.Item>
          <Form.Item label="Color Name" name="colorName">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Order;
