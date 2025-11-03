🍽️ Food Delivery Simulator — Frontend (Next.js)

This is the Frontend for the Food Delivery Simulation System.
It allows one user to act as three different roles:

Role	Actions
👤 Customer	Browse menu, create order, cancel pending order
🏪 Restaurant	View pending orders, accept order, mark prepared
🛵 Driver	View prepared orders, pick up order, deliver order

The UI simulates the entire food-order lifecycle in one dashboard.
🏗️ Tech Stack
Category	Technology
Framework	Next.js 14
Language	TypeScript
Styling	Tailwind CSS
State Handling	React Hooks
API Layer	Custom API Hook (useGeneralApiCall)
Auth	Token-based (localStorage)

🚦 User Flows
✅ 1. Customer Panel

Features

View mock restorent then click restorent show the restorent items (complete Dynamic).

Add items to cart

Place order → /orders/create/

Cancel order if status = PENDING

See live order status updates via refresh

States

Action	Status
Order placed	PENDING
Restaurant accepted	ACCEPTED
Restaurant prepared	PREPARED
Driver picked	PICKED_UP
Delivered	DELIVERED
🏪 2. Restaurant Panel

Features

See Pending orders → /orders/pending/

Accept Order → /orders/accept/{id}/

Mark as Prepared → /orders/prepare/{id}/

Buttons

Condition	Button
Order = PENDING	Accept
Order = ACCEPTED	Mark Prepared
Prepared Orders	Read-only
🛵 3. Driver Panel

Features

Fetch prepared orders → /orders/prepared/

Pick Order → /orders/pickup/{id}/

Deliver Order → /orders/deliver/{id}/

Stages

Stage	Action
PREPARED	Button — Pick Up
PICKED_UP	Button — Deliver
DELIVERED	✅ Read only


🚀 Frontend Setup — Run Locally

Follow the steps below to run the frontend on your local machine after cloning the repository.
✅ Prerequisites

Make sure the following are installed:

Tool	Required Version
Node.js	v18+
npm / yarn	npm v9+ or yarn v1+
Git	Latest

Recommended: Use Node 18 LTS for best compatibility.

git clone https://github.com/shishpal2000/Food-Delivery-System.git
cd <your-repo-name>/frontend

npm install

NEXT_PUBLIC_API_URL=http://localhost:8000/api

npm run dev

http://localhost:3001
