# ✨ ART_SHINERSSS – Handmade Jewellery Boutique Website

A luxury, mobile-friendly, static e-commerce website for **ART_SHINERSSS**, an artisan boutique specializing in handmade bracelets, beaded chains, necklaces, and personalized custom jewellery with direct **WhatsApp Ordering**.

---

## 🌸 Business & Order Information

- **Shop Name**: ART_SHINERSSS
- **WhatsApp Order Number**: `+91 81229 65239` (Country code: `91`, Raw: `918122965239`)
- **Direct WhatsApp Chat**: [https://wa.me/918122965239](https://wa.me/918122965239)
- **Instagram**: `@art_shinersss`
- **Delivery**: Pan-India shipping (Delivery charges confirmed on WhatsApp)

---

## 💎 Features & Highlights

1. **Elegant Boutique Aesthetic**:
   - Palette: Blush pink, warm cream, soft champagne, and radiant gold accents.
   - Clean, modern typography using *Playfair Display*, *Cormorant Garamond*, and *Plus Jakarta Sans*.
   - Responsive, mobile-first design with micro-animations, glassmorphism header, and floating badges.

2. **Full Product Catalogue Across 8 Categories**:
   - Handmade Bracelets
   - Beaded Bracelets
   - Friendship Bracelets
   - Handmade Chains
   - Necklaces
   - Pendant Chains
   - Customized Name Jewellery
   - Bracelet and Chain Gift Sets

3. **Seamless WhatsApp Ordering**:
   - **Direct Product Order**: Every product card and quick-view modal includes a direct **Buy on WA** button that formats product name, variant, and quantity into a WhatsApp message.
   - **Interactive Shopping Bag / Cart**: Add multiple items, adjust quantities, input delivery city/name, track free shipping meter, and checkout the entire cart into a structured WhatsApp order breakdown for the shop owner to confirm.
   - **Custom Jewellery Studio Form**: Allows customers to select jewellery type, color palette, wrist/neck size, personalization (name/initials), and budget. Submitting opens WhatsApp pre-filled with the request so customers can attach reference images directly in chat!

4. **100% Static & GitHub Pages Ready**:
   - Built with clean HTML5, CSS3, and Vanilla JavaScript.
   - No build tools or Node.js required. Relative paths used everywhere for seamless hosting.

---

## 📁 File Structure

```
art-shinersss/
├── index.html            # Main boutique homepage and sections
├── style.css             # Complete design system, animations & responsive styles
├── script.js             # Cart logic, WhatsApp message builders, search & filters
├── products.js           # Editable product catalog with prices in ₹, colors, and descriptions
├── assets/
│   └── images/           # Curated & generated high-res jewelry photos
│       ├── hero-jewellery.jpg
│       ├── bracelet-beaded.jpg
│       ├── friendship-bracelet.jpg
│       ├── pendant-chain.jpg
│       ├── custom-name.jpg
│       ├── gift-set.jpg
│       ├── chain-gold.jpg
│       ├── chain-choker.jpg
│       ├── necklace-crystal.jpg
│       ├── bracelet-pearl.jpg
│       ├── bracelet-evil-eye.jpg
│       ├── bracelet-gemstone.jpg
│       └── ring-set.jpg
└── README.md             # Documentation and GitHub Pages deployment guide
```

---

## 🚀 How to Run Locally

You can run this website instantly without installing any backend or compiler:

### Option 1: Direct in Browser
Simply double-click `index.html` or right-click and choose **Open with Google Chrome** (or Edge/Brave/Firefox).

### Option 2: Using VS Code Live Server
1. Open the project folder in VS Code.
2. Right click `index.html` and click **"Open with Live Server"**.

### Option 3: Using Python or Node
In PowerShell or terminal:
```bash
# Python 3
python -m http.server 8000
# Open http://localhost:8000 in your browser
```
or
```bash
# Node
npx serve
```

---

## 🌐 How to Upload to GitHub and Enable GitHub Pages

Follow these simple steps to deploy your website live on the internet for free using GitHub Pages:

### Step 1: Create a GitHub Repository
1. Log in to [GitHub.com](https://github.com).
2. Click the **`+`** icon at the top right and select **"New repository"**.
3. Name your repository (e.g., `art-shinersss` or `art-shinersss-jewellery`).
4. Choose **Public** visibility.
5. Leave "Initialize this repository with a README" **unchecked** (we already have one).
6. Click **"Create repository"**.

### Step 2: Push your Files to GitHub
Open PowerShell or Terminal in your project directory (`c:\Users\VIKI\Desktop\RITHU PAPA`):

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial release of ART_SHINERSSS handmade jewellery website"

# Rename branch to main
git branch -M main

# Link to your new GitHub repository (replace USERNAME and REPO_NAME with yours)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push files to GitHub
git push -u origin main
```

*(Alternatively, you can simply open the repository on GitHub.com in your web browser, click **"Add file"** > **"Upload files"**, drag and drop all the files and the `assets/` folder, and commit them.)*

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click on the **"Settings"** tab (top navigation bar).
3. In the left sidebar, click on **"Pages"** (under Code and automation).
4. Under **"Build and deployment"** > **"Branch"**:
   - Select **`main`** from the dropdown.
   - Keep the folder set to **`/(root)`**.
   - Click **"Save"**.
5. Wait 1 to 2 minutes. Refresh the page, and GitHub will provide you with your live URL:
   ```
   https://USERNAME.github.io/REPO_NAME/
   ```
6. Your ART_SHINERSSS website is now live worldwide! 🎉

---

## ✏️ How to Edit Products and Prices

All products are stored cleanly in [`products.js`](products.js). To change a price, add a new piece, or update photos:

1. Open `products.js` in any text editor.
2. Each item looks like this:
```javascript
{
  id: "prod-001",
  name: "Blush Rose Quartz & Pearl Bracelet",
  category: "Handmade Bracelets",
  subcategory: "Beaded Bracelets",
  price: 399,                 // <-- Edit current price in ₹
  originalPrice: 599,         // <-- Edit original price (shows discount tag)
  image: "assets/images/bracelet-beaded.jpg", // <-- Path to your photo
  badge: "Bestseller",        // <-- Optional badge (Trending, New Arrival, etc.)
  rating: 4.9,
  reviewCount: 42,
  availability: "In Stock",   // <-- "In Stock" or "Made to Order"
  colors: ["Rose Quartz Pink", "Cream Pearl", "Pastel Lavender"],
  description: "Handcrafted with natural rose quartz crystals...",
  featured: true
}
```
3. Save the file and refresh the browser. The changes appear immediately!

---

## ⚡ How to Add Products Directly on GitHub (No Local PC Needed!)

With the included **GitHub Actions workflow**, you can upload jewellery photos directly on **GitHub.com** (even from your phone!), and your website will automatically add the product!

### Step 1: Upload directly in GitHub
1. Open your repository on **GitHub.com**.
2. Click into the folder: `assets` → `images` → `products`.
3. Click **Add file** ➔ **Upload files**.
4. Choose your image file, named with Category, Name, and Price:
   ```
   Handmade Bracelets_Rose Quartz Glamour Bracelet_399.jpg
   ```
5. Click the green **Commit changes** button.

### Step 2: Automatic Magic!
- GitHub Actions automatically wakes up, reads the filename, extracts the category, name, and ₹ price.
- It updates `products.js` with the new product item.
- Your live GitHub Pages website updates within 60 seconds!

---

## 📲 How WhatsApp Ordering Works

### 1. Single Product Order
When a visitor clicks **"Buy on WA"** on any card or in the Quick View modal, it triggers:
```javascript
const whatsappNumber = "918122965239";
function orderOnWhatsApp(productName, price, quantity, color) {
  // Pre-fills order details and opens https://wa.me/918122965239?text=...
}
```

### 2. Multi-Item Bag Checkout
When a customer adds multiple pieces to their bag and clicks **"Complete Order on WhatsApp"**, it calculates:
- Total items & variant colors
- Subtotal in ₹
- Delivery charges confirmation request
- Customer delivery name & city
- Opens WhatsApp with a clean, itemized invoice summary so you can verify stock and share your UPI ID / QR code.

### 3. Custom Design Studio
When someone submits the custom form, it formats their dream bracelet/chain requirements (colors, wrist size, initials charm, budget) and sends it directly to your WhatsApp. The customer can then send reference photos in the same chat.

---

## 🛠️ Customization & Support
- To change the WhatsApp number, simply edit `const whatsappNumber = "918122965239";` in [`script.js`](script.js).
- To edit social links or email, modify the contact links in [`index.html`](index.html).

