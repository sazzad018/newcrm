var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/pdf-generator.ts
var pdf_generator_exports = {};
__export(pdf_generator_exports, {
  generateInvoicePDF: () => generateInvoicePDF
});
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
function hasBengaliChars(text2) {
  const bengaliRange = /[\u0980-\u09FF]/;
  return bengaliRange.test(text2);
}
function getFontForText(text2, isBold = false) {
  if (hasBengaliChars(text2)) {
    return isBold ? "Bengali-Bold" : "Bengali";
  }
  return isBold ? "Helvetica-Bold" : "Helvetica";
}
function generateInvoicePDF(invoice, client) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    bufferPages: true
  });
  const bengaliRegularPath = path.join(__dirname, "fonts", "NotoSansBengali-Regular.ttf");
  const bengaliBoldPath = path.join(__dirname, "fonts", "NotoSansBengali-Bold.ttf");
  doc.registerFont("Bengali", bengaliRegularPath);
  doc.registerFont("Bengali-Bold", bengaliBoldPath);
  const brandColor = invoice.brandColor || "#BFA1FE";
  const currency = invoice.currency || "BDT";
  const currencySymbol = currency === "BDT" ? "\u09F3" : currency === "USD" ? "$" : "\u20AC";
  doc.rect(0, 0, doc.page.width, 120).fill(brandColor);
  const companyName = invoice.companyName || "Social Ads Expert";
  doc.fillColor("#FFFFFF").fontSize(24).font(getFontForText(companyName, true)).text(companyName, 50, 30);
  const companyEmail = invoice.companyEmail || "support@agentcrm.com";
  const companyPhone = invoice.companyPhone || "+8801XXXXXXXXX";
  const companyAddress = invoice.companyAddress || "Dhaka, Bangladesh";
  doc.fontSize(10).font(getFontForText(companyEmail)).text(companyEmail, 50, 60);
  doc.font(getFontForText(companyPhone)).text(companyPhone, 50, 75);
  doc.font(getFontForText(companyAddress)).text(companyAddress, 50, 90);
  const invoiceTitle = "INVOICE";
  doc.fillColor("#000000").fontSize(28).font(getFontForText(invoiceTitle, true)).text(invoiceTitle, 400, 40, { align: "right" });
  const detailsY = 150;
  const invoiceNumberLabel = "Invoice Number:";
  doc.fontSize(10).font(getFontForText(invoiceNumberLabel)).fillColor("#666666").text(invoiceNumberLabel, 400, detailsY);
  doc.fillColor("#000000").font(getFontForText(invoice.invoiceNumber, true)).text(invoice.invoiceNumber, 400, detailsY + 15);
  const issueDate = invoice.issueDate instanceof Date ? invoice.issueDate : new Date(invoice.issueDate || Date.now());
  const issueDateLabel = "Issue Date:";
  const issueDateText = issueDate.toLocaleDateString();
  doc.fillColor("#666666").font(getFontForText(issueDateLabel)).text(issueDateLabel, 400, detailsY + 35);
  doc.fillColor("#000000").font(getFontForText(issueDateText, true)).text(issueDateText, 400, detailsY + 50);
  if (invoice.workStartDate && invoice.workEndDate) {
    const startDate = invoice.workStartDate instanceof Date ? invoice.workStartDate : new Date(invoice.workStartDate);
    const endDate = invoice.workEndDate instanceof Date ? invoice.workEndDate : new Date(invoice.workEndDate);
    const workPeriodLabel = "Work Period:";
    const workPeriodText = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    doc.fillColor("#666666").font(getFontForText(workPeriodLabel)).text(workPeriodLabel, 400, detailsY + 70);
    doc.fillColor("#000000").font(getFontForText(workPeriodText, true)).text(workPeriodText, 400, detailsY + 85);
  }
  const billToLabel = "BILL TO:";
  doc.fillColor("#666666").fontSize(12).font(getFontForText(billToLabel, true)).text(billToLabel, 50, detailsY);
  const clientName = client.name || "N/A";
  doc.fillColor("#000000").fontSize(11).font(getFontForText(clientName, true)).text(clientName, 50, detailsY + 20);
  let clientY = detailsY + 35;
  if (client.companyName) {
    doc.font(getFontForText(client.companyName)).text(client.companyName, 50, clientY);
    clientY += 15;
  }
  if (client.email) {
    doc.font(getFontForText(client.email)).text(client.email, 50, clientY);
    clientY += 15;
  }
  if (client.phone) {
    doc.font(getFontForText(client.phone)).text(client.phone, 50, clientY);
  }
  const tableTop = 320;
  const itemX = 50;
  const qtyX = 300;
  const rateX = 370;
  const amountX = 470;
  doc.rect(50, tableTop - 10, doc.page.width - 100, 25).fill("#F5F5F5");
  const descLabel = "Description";
  const qtyLabel = "Qty";
  const rateLabel = "Rate";
  const amountLabel = "Amount";
  doc.fillColor("#000000").fontSize(10).font(getFontForText(descLabel, true)).text(descLabel, itemX, tableTop);
  doc.font(getFontForText(qtyLabel, true)).text(qtyLabel, qtyX, tableTop);
  doc.font(getFontForText(rateLabel, true)).text(rateLabel, rateX, tableTop);
  doc.font(getFontForText(amountLabel, true)).text(amountLabel, amountX, tableTop);
  let lineItems = [];
  if (typeof invoice.lineItems === "string") {
    try {
      lineItems = JSON.parse(invoice.lineItems);
    } catch (e) {
      lineItems = [];
    }
  } else if (Array.isArray(invoice.lineItems)) {
    lineItems = invoice.lineItems;
  }
  let currentY = tableTop + 30;
  lineItems.forEach((item, i) => {
    const itemHeight = 25;
    if (i % 2 === 0) {
      doc.rect(50, currentY - 5, doc.page.width - 100, itemHeight).fill("#FAFAFA");
    }
    const description = item.description || "N/A";
    const quantity = item.quantity || 0;
    const rate = parseFloat(item.rate || "0");
    const amount = parseFloat(item.amount || "0");
    const quantityText = quantity.toString();
    const rateText = `${currencySymbol}${rate.toFixed(2)}`;
    const amountText = `${currencySymbol}${amount.toFixed(2)}`;
    doc.fillColor("#000000").fontSize(10).font(getFontForText(description)).text(description, itemX, currentY, { width: 240 });
    doc.font(getFontForText(quantityText)).text(quantityText, qtyX, currentY);
    doc.font(getFontForText(rateText)).text(rateText, rateX, currentY);
    doc.font(getFontForText(amountText, true)).text(amountText, amountX, currentY);
    currentY += itemHeight;
  });
  const subtotal = lineItems.reduce(
    (sum, item) => sum + parseFloat(item.amount || "0"),
    0
  );
  const discountPercent = parseFloat(invoice.discountPercent || "0");
  const vatPercent = parseFloat(invoice.vatPercent || "0");
  const discount = subtotal * discountPercent / 100;
  const afterDiscount = subtotal - discount;
  const vat = afterDiscount * vatPercent / 100;
  const total = afterDiscount + vat;
  currentY += 20;
  const summaryX = 370;
  const subtotalLabel = "Subtotal:";
  const subtotalText = `${currencySymbol}${subtotal.toFixed(2)}`;
  doc.fontSize(10).font(getFontForText(subtotalLabel)).fillColor("#666666").text(subtotalLabel, summaryX, currentY);
  doc.fillColor("#000000").font(getFontForText(subtotalText, true)).text(subtotalText, amountX, currentY);
  if (discountPercent > 0) {
    currentY += 20;
    const discountLabel = `Discount (${discountPercent}%):`;
    const discountText = `-${currencySymbol}${discount.toFixed(2)}`;
    doc.fillColor("#666666").font(getFontForText(discountLabel)).text(discountLabel, summaryX, currentY);
    doc.fillColor("#FF0000").font(getFontForText(discountText, true)).text(discountText, amountX, currentY);
  }
  if (vatPercent > 0) {
    currentY += 20;
    const vatLabel = `VAT/GST (${vatPercent}%):`;
    const vatText = `${currencySymbol}${vat.toFixed(2)}`;
    doc.fillColor("#666666").font(getFontForText(vatLabel)).text(vatLabel, summaryX, currentY);
    doc.fillColor("#000000").font(getFontForText(vatText, true)).text(vatText, amountX, currentY);
  }
  currentY += 25;
  doc.rect(summaryX - 10, currentY - 10, 185, 35).fill(brandColor);
  const totalLabel = "TOTAL:";
  const totalText = `${currencySymbol}${total.toFixed(2)}`;
  doc.fillColor("#FFFFFF").fontSize(14).font(getFontForText(totalLabel, true)).text(totalLabel, summaryX, currentY);
  doc.fontSize(16).font(getFontForText(totalText, true)).text(totalText, amountX - 10, currentY);
  const footerText = "Thank you for your business!";
  doc.fillColor("#999999").fontSize(9).font(getFontForText(footerText)).text(
    footerText,
    50,
    doc.page.height - 100,
    { align: "center", width: doc.page.width - 100 }
  );
  if (invoice.companyWebsite) {
    doc.font(getFontForText(invoice.companyWebsite)).text(
      invoice.companyWebsite,
      50,
      doc.page.height - 80,
      { align: "center", width: doc.page.width - 100 }
    );
  }
  return doc;
}
var __filename, __dirname;
var init_pdf_generator = __esm({
  "server/pdf-generator.ts"() {
    "use strict";
    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
  }
});

// server/index.shared-hosting.ts
import express from "express";

// server/routes.shared-hosting.ts
import { createServer } from "http";

// server/db.shared-hosting.ts
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  campaignTitles: () => campaignTitles,
  clientTags: () => clientTags,
  clientTagsRelations: () => clientTagsRelations,
  clients: () => clients,
  clientsRelations: () => clientsRelations,
  facebookMarketing: () => facebookMarketing,
  facebookMarketingRelations: () => facebookMarketingRelations,
  insertCampaignTitleSchema: () => insertCampaignTitleSchema,
  insertClientSchema: () => insertClientSchema,
  insertClientTagSchema: () => insertClientTagSchema,
  insertFacebookMarketingSchema: () => insertFacebookMarketingSchema,
  insertInvoiceSchema: () => insertInvoiceSchema,
  insertOfferSchema: () => insertOfferSchema,
  insertQuickMessageSchema: () => insertQuickMessageSchema,
  insertTagSchema: () => insertTagSchema,
  insertTransactionSchema: () => insertTransactionSchema,
  insertWebsiteDetailsSchema: () => insertWebsiteDetailsSchema,
  invoices: () => invoices,
  invoicesRelations: () => invoicesRelations,
  offers: () => offers,
  quickMessages: () => quickMessages,
  tags: () => tags,
  tagsRelations: () => tagsRelations,
  transactions: () => transactions,
  transactionsRelations: () => transactionsRelations,
  websiteDetails: () => websiteDetails,
  websiteDetailsRelations: () => websiteDetailsRelations
});
import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var clients = pgTable("clients", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  companyName: text("company_name"),
  status: text("status").notNull().default("active"),
  // active, inactive
  category: text("category").notNull().default("normal"),
  // normal, website-needed, business-plan-needed, final
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  portalId: varchar("portal_id").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var facebookMarketing = pgTable("facebook_marketing", {
  id: varchar("id").primaryKey(),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull().defaultNow(),
  dailySpend: decimal("daily_spend", { precision: 10, scale: 2 }).default("0"),
  reach: integer("reach").default(0),
  sales: integer("sales").default(0),
  campaignDetails: text("campaign_details"),
  adAccountId: text("ad_account_id"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var websiteDetails = pgTable("website_details", {
  id: varchar("id").primaryKey(),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  websiteName: text("website_name"),
  websiteUrl: text("website_url"),
  websitePassword: text("website_password"),
  wordpressUsername: text("wordpress_username"),
  wordpressPassword: text("wordpress_password"),
  cpanelUsername: text("cpanel_username"),
  cpanelPassword: text("cpanel_password"),
  nameServer1: text("name_server_1"),
  nameServer2: text("name_server_2"),
  websitePackageName: text("website_package_name"),
  serviceNote: text("service_note"),
  whatsappUsername: text("whatsapp_username"),
  whatsappPassword: text("whatsapp_password"),
  otherDetails: text("other_details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var transactions = pgTable("transactions", {
  id: varchar("id").primaryKey(),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  // "topup" or "expense"
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var invoices = pgTable("invoices", {
  id: varchar("id").primaryKey(),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  // pending, paid
  lineItems: jsonb("line_items").notNull(),
  // Array of {description, quantity, rate, amount}
  issueDate: timestamp("issue_date").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
  // Company Information
  companyName: text("company_name").default("Social Ads Expert"),
  companyEmail: text("company_email").default("support@agentcrm.com"),
  companyPhone: text("company_phone").default("+8801XXXXXXXXX"),
  companyAddress: text("company_address").default("Dhaka, Bangladesh"),
  companyWebsite: text("company_website"),
  // Invoice Details
  currency: text("currency").default("BDT"),
  workStartDate: timestamp("work_start_date"),
  workEndDate: timestamp("work_end_date"),
  discountPercent: decimal("discount_percent", { precision: 5, scale: 2 }).default("0"),
  vatPercent: decimal("vat_percent", { precision: 5, scale: 2 }).default("0"),
  brandColor: text("brand_color").default("#BFA1FE"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var tags = pgTable("tags", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("#6B7280"),
  // hex color code
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var clientTags = pgTable("client_tags", {
  id: varchar("id").primaryKey(),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  tagId: varchar("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var offers = pgTable("offers", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  validUntil: timestamp("valid_until"),
  isActive: text("is_active").notNull().default("true"),
  // true, false
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var campaignTitles = pgTable("campaign_titles", {
  id: varchar("id").primaryKey(),
  clientName: text("client_name").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  endDate: timestamp("end_date").notNull(),
  generatedTitle: text("generated_title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var quickMessages = pgTable("quick_messages", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  category: text("category").default("general"),
  // general, payment, address, contact
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var clientsRelations = relations(clients, ({ many, one }) => ({
  facebookMarketing: many(facebookMarketing),
  websiteDetails: one(websiteDetails, {
    fields: [clients.id],
    references: [websiteDetails.clientId]
  }),
  transactions: many(transactions),
  invoices: many(invoices),
  clientTags: many(clientTags)
}));
var facebookMarketingRelations = relations(facebookMarketing, ({ one }) => ({
  client: one(clients, {
    fields: [facebookMarketing.clientId],
    references: [clients.id]
  })
}));
var websiteDetailsRelations = relations(websiteDetails, ({ one }) => ({
  client: one(clients, {
    fields: [websiteDetails.clientId],
    references: [clients.id]
  })
}));
var transactionsRelations = relations(transactions, ({ one }) => ({
  client: one(clients, {
    fields: [transactions.clientId],
    references: [clients.id]
  })
}));
var invoicesRelations = relations(invoices, ({ one }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id]
  })
}));
var tagsRelations = relations(tags, ({ many }) => ({
  clientTags: many(clientTags)
}));
var clientTagsRelations = relations(clientTags, ({ one }) => ({
  client: one(clients, {
    fields: [clientTags.clientId],
    references: [clients.id]
  }),
  tag: one(tags, {
    fields: [clientTags.tagId],
    references: [tags.id]
  })
}));
var insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  portalId: true,
  createdAt: true
});
var insertFacebookMarketingSchema = createInsertSchema(facebookMarketing).omit({
  id: true,
  createdAt: true
}).extend({
  date: z.coerce.date().optional()
});
var insertWebsiteDetailsSchema = createInsertSchema(websiteDetails).omit({
  id: true,
  updatedAt: true
});
var insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true
});
var insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true
}).extend({
  invoiceNumber: z.string().optional(),
  issueDate: z.coerce.date().optional(),
  dueDate: z.string().optional().transform((val) => val ? new Date(val) : void 0),
  workStartDate: z.string().optional().transform((val) => val ? new Date(val) : void 0),
  workEndDate: z.string().optional().transform((val) => val ? new Date(val) : void 0),
  discountPercent: z.string().or(z.number()).transform(String).optional(),
  vatPercent: z.string().or(z.number()).transform(String).optional()
});
var insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true
});
var insertClientTagSchema = createInsertSchema(clientTags).omit({
  id: true,
  createdAt: true
});
var insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  validUntil: z.string().optional().transform((val) => val ? new Date(val) : void 0)
});
var insertCampaignTitleSchema = createInsertSchema(campaignTitles).omit({
  id: true,
  createdAt: true
}).extend({
  endDate: z.coerce.date()
});
var insertQuickMessageSchema = createInsertSchema(quickMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.shared-hosting.ts
var { Pool } = pg;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var dbUrl = process.env.DATABASE_URL;
var isLocalDB = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.") || dbUrl.includes("::1");
var poolConfig = {
  connectionString: dbUrl,
  max: 10,
  // Maximum connections in pool
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 1e4
};
if (isLocalDB) {
  poolConfig.ssl = false;
} else {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}
var pool = new Pool(poolConfig);
var db = drizzle(pool, { schema: schema_exports });
var connectionType = isLocalDB ? "localhost (SSL disabled)" : "remote (SSL relaxed)";
console.log(`[Database] Connected to ${connectionType}`);

// server/storage.shared-hosting.ts
import { eq, desc, sql as sql2, and } from "drizzle-orm";
import { randomUUID } from "crypto";
function generateUUID() {
  return randomUUID();
}
var PgStorage = class {
  // Clients
  async createClient(data) {
    const id = generateUUID();
    const portalId = generateUUID();
    const [client] = await db.insert(clients).values({ ...data, id, portalId }).returning();
    return client;
  }
  async getClient(id) {
    const [client] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return client;
  }
  async getClientByPortalId(portalId) {
    const [client] = await db.select().from(clients).where(eq(clients.portalId, portalId)).limit(1);
    return client;
  }
  async getClients() {
    return db.select().from(clients).orderBy(desc(clients.createdAt));
  }
  async updateClient(id, data) {
    const [client] = await db.update(clients).set(data).where(eq(clients.id, id)).returning();
    return client;
  }
  async deleteClient(id) {
    await db.delete(clients).where(eq(clients.id, id));
    return { success: true };
  }
  // Facebook Marketing
  async createFacebookMarketing(data) {
    const id = generateUUID();
    const [fb] = await db.insert(facebookMarketing).values({ ...data, id }).returning();
    
    // Auto-deduct daily spend from client balance (without creating transaction)
    if (fb.dailySpend && parseFloat(fb.dailySpend) > 0) {
      const client = await this.getClient(data.clientId);
      if (client) {
        const newBalance = (parseFloat(client.balance) || 0) - parseFloat(fb.dailySpend);
        await this.updateClient(data.clientId, { balance: newBalance.toString() });
      }
    }
    
    return fb;
  }
  async getFacebookMarketing(clientId) {
    const [fb] = await db.select().from(facebookMarketing).where(eq(facebookMarketing.clientId, clientId)).orderBy(desc(facebookMarketing.date)).limit(1);
    return fb;
  }
  async getAllFacebookMarketing(clientId, limit = 10, offset = 0) {
    return db.select().from(facebookMarketing)
      .where(eq(facebookMarketing.clientId, clientId))
      .orderBy(desc(facebookMarketing.date))
      .limit(limit)
      .offset(offset);
  }
  async deleteFacebookMarketing(id) {
    await db.delete(facebookMarketing).where(eq(facebookMarketing.id, id));
    return { success: true };
  }
  async updateFacebookMarketing(clientId, data) {
    const existing = await this.getFacebookMarketing(clientId);
    if (existing) {
      const [fb] = await db.update(facebookMarketing).set(data).where(eq(facebookMarketing.clientId, clientId)).returning();
      return fb;
    } else {
      return this.createFacebookMarketing({ ...data, clientId });
    }
  }
  // Website Details
  async createWebsiteDetails(data) {
    const id = generateUUID();
    const [website] = await db.insert(websiteDetails).values({ ...data, id }).returning();
    return website;
  }
  async getWebsiteDetails(clientId) {
    const [website] = await db.select().from(websiteDetails).where(eq(websiteDetails.clientId, clientId)).limit(1);
    return website;
  }
  async updateWebsiteDetails(clientId, data) {
    const existing = await this.getWebsiteDetails(clientId);
    if (existing) {
      const [website] = await db.update(websiteDetails).set(data).where(eq(websiteDetails.clientId, clientId)).returning();
      return website;
    } else {
      return this.createWebsiteDetails({ ...data, clientId });
    }
  }
  // Transactions
  async createTransaction(data) {
    const id = generateUUID();
    const [transaction] = await db.insert(transactions).values({ ...data, id }).returning();
    const client = await this.getClient(data.clientId);
    if (client) {
      const newBalance = data.type === "topup" ? (parseFloat(client.balance) || 0) + parseFloat(data.amount) : (parseFloat(client.balance) || 0) - parseFloat(data.amount);
      await this.updateClient(data.clientId, { balance: newBalance.toString() });
    }
    return transaction;
  }
  async getTransactions(clientId, limit = 10, offset = 0) {
    return db.select().from(transactions)
      .where(eq(transactions.clientId, clientId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit)
      .offset(offset);
  }
  async getAllTransactions() {
    return db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }
  // Invoices
  async createInvoice(data) {
    const id = generateUUID();
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const count = await db.select({ count: sql2`count(*)` }).from(invoices).where(sql2`EXTRACT(YEAR FROM ${invoices.createdAt}) = ${year}`);
    const invoiceNumber = `INV-${year}-${String((count[0]?.count || 0) + 1).padStart(4, "0")}`;
    const [invoice] = await db.insert(invoices).values({ ...data, id, invoiceNumber }).returning();
    return invoice;
  }
  async getInvoice(id) {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
    return invoice;
  }
  async getInvoices(clientId) {
    if (clientId) {
      return db.select().from(invoices).where(eq(invoices.clientId, clientId)).orderBy(desc(invoices.createdAt));
    }
    return db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }
  async updateInvoice(id, data) {
    const [invoice] = await db.update(invoices).set(data).where(eq(invoices.id, id)).returning();
    return invoice;
  }
  async deleteInvoice(id) {
    await db.delete(invoices).where(eq(invoices.id, id));
    return { success: true };
  }
  // Tags
  async createTag(data) {
    const id = generateUUID();
    const [tag] = await db.insert(tags).values({ ...data, id }).returning();
    return tag;
  }
  async getTags() {
    return db.select().from(tags);
  }
  async updateTag(id, data) {
    const [tag] = await db.update(tags).set(data).where(eq(tags.id, id)).returning();
    return tag;
  }
  async deleteTag(id) {
    await db.delete(tags).where(eq(tags.id, id));
    return { success: true };
  }
  // Client Tags
  async addClientTag(clientId, tagId) {
    const id = generateUUID();
    const [clientTag] = await db.insert(clientTags).values({ id, clientId, tagId }).returning();
    return clientTag;
  }
  async getClientTags(clientId) {
    return db.select().from(clientTags).where(eq(clientTags.clientId, clientId));
  }
  async removeClientTag(clientId, tagId) {
    await db.delete(clientTags).where(
      and(
        eq(clientTags.clientId, clientId),
        eq(clientTags.tagId, tagId)
      )
    );
    return { success: true };
  }
  // Offers
  async createOffer(data) {
    const id = generateUUID();
    const [offer] = await db.insert(offers).values({ ...data, id }).returning();
    return offer;
  }
  async getOffers() {
    return db.select().from(offers).orderBy(desc(offers.createdAt));
  }
  async getActiveOffers() {
    return db.select().from(offers).where(eq(offers.isActive, "true")).orderBy(desc(offers.createdAt));
  }
  async updateOffer(id, data) {
    const [offer] = await db.update(offers).set(data).where(eq(offers.id, id)).returning();
    return offer;
  }
  async deleteOffer(id) {
    await db.delete(offers).where(eq(offers.id, id));
    return { success: true };
  }
  // Quick Messages
  async createQuickMessage(data) {
    const id = generateUUID();
    const [message] = await db.insert(quickMessages).values({ ...data, id }).returning();
    return message;
  }
  async getQuickMessages() {
    return db.select().from(quickMessages).orderBy(desc(quickMessages.createdAt));
  }
  async updateQuickMessage(id, data) {
    const [message] = await db.update(quickMessages).set(data).where(eq(quickMessages.id, id)).returning();
    return message;
  }
  async deleteQuickMessage(id) {
    await db.delete(quickMessages).where(eq(quickMessages.id, id));
    return { success: true };
  }
  // Campaign Titles
  async createCampaignTitle(data) {
    const id = generateUUID();
    const [campaignTitle] = await db.insert(campaignTitles).values({ ...data, id }).returning();
    return campaignTitle;
  }
  async getCampaignTitles() {
    return db.select().from(campaignTitles).orderBy(desc(campaignTitles.createdAt));
  }
  async deleteCampaignTitle(id) {
    await db.delete(campaignTitles).where(eq(campaignTitles.id, id));
    return { success: true };
  }
  // Stats
  async getStats() {
    const [clientStats] = await db.select({
      total: sql2`count(*)`,
      active: sql2`count(*) filter (where status = 'active')`
    }).from(clients);
    const [balanceStats] = await db.select({
      totalBalance: sql2`coalesce(sum(cast(balance as decimal)), 0)`
    }).from(clients);
    const [campaignStats] = await db.select({
      totalSpend: sql2`coalesce(sum(cast(daily_spend as decimal)), 0)`
    }).from(facebookMarketing);
    
    // Calculate monthly top-ups (current month only, type='top-up')
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const [monthlyTopUps] = await db.select({
      monthlyRevenue: sql2`coalesce(sum(cast(amount as decimal)), 0)`
    }).from(transactions)
      .where(sql2`type = 'topup' AND created_at >= ${startOfMonth.toISOString()}`);
    
    return {
      totalClients: clientStats?.total || 0,
      activeClients: clientStats?.active || 0,
      totalBalance: balanceStats?.totalBalance || 0,
      totalAdSpend: campaignStats?.totalSpend || 0,
      monthlyRevenue: monthlyTopUps?.monthlyRevenue || 0
    };
  }
};
var storage = new PgStorage();

// server/routes.shared-hosting.ts
async function registerRoutes(app2, requireAuth) {
  // Admin routes - protected
  app2.get("/api/clients", requireAuth, async (req, res) => {
    try {
      const clients2 = await storage.getClients();
      res.json(clients2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/clients/:id", requireAuth, async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      const fbRecords = await storage.getAllFacebookMarketing(client.id, 10, 0);
      const website = await storage.getWebsiteDetails(client.id);
      const transactions2 = await storage.getTransactions(client.id, 10, 0);
      
      // Filter only top-up transactions and format with + signs
      const topUpOnly = transactions2.filter(t => t.type === 'topup');
      const formattedTransactions = topUpOnly.map(t => ({
        ...t,
        formattedAmount: `+${t.amount}`,
        displayType: 'ব্যালেন্স যোগ'
      }));
      
      res.json({
        ...client,
        facebookMarketing: fbRecords,
        websiteDetails: website,
        transactions: formattedTransactions
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/clients", requireAuth, async (req, res) => {
    try {
      const validated = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validated);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/clients/:id", requireAuth, async (req, res) => {
    try {
      const validated = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, validated);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/clients/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteClient(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/clients/:id/facebook-marketing", requireAuth, async (req, res) => {
    try {
      const fbData = { ...req.body, clientId: req.params.id };
      const validated = insertFacebookMarketingSchema.parse(fbData);
      const fb = await storage.createFacebookMarketing(validated);
      res.json(fb);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/clients/:id/facebook-marketing", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;
      const fbRecords = await storage.getAllFacebookMarketing(req.params.id, limit, offset);
      res.json(fbRecords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/facebook-marketing/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteFacebookMarketing(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/clients/:id/website-details", requireAuth, async (req, res) => {
    try {
      const websiteData = { ...req.body, clientId: req.params.id };
      const validated = insertWebsiteDetailsSchema.parse(websiteData);
      const website = await storage.updateWebsiteDetails(req.params.id, validated);
      res.json(website);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/clients/:id/website-details", async (req, res) => {
    try {
      const website = await storage.getWebsiteDetails(req.params.id);
      res.json(website || null);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/clients/:id/topup", requireAuth, async (req, res) => {
    try {
      const { amount, description } = req.body;
      const clientId = req.params.id;
      const transactionData = {
        clientId,
        type: "topup",
        amount: amount.toString(),
        description: description || "Top-up",
        date: new Date()
      };
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/transactions", requireAuth, async (req, res) => {
    try {
      const validated = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validated);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/clients/:id/transactions", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;
      const transactions2 = await storage.getTransactions(req.params.id, limit, offset);
      
      // Filter only top-up transactions (not expenses from FB marketing)
      const topUpOnly = transactions2.filter(t => t.type === 'topup');
      
      // Add formatted amount with + sign for display
      const formattedTransactions = topUpOnly.map(t => ({
        ...t,
        formattedAmount: `+${t.amount}`,
        displayType: 'ব্যালেন্স যোগ'
      }));
      
      res.json(formattedTransactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/transactions", async (req, res) => {
    try {
      const transactions2 = await storage.getAllTransactions();
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/invoices", requireAuth, async (req, res) => {
    try {
      const validated = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(validated);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/invoices", requireAuth, async (req, res) => {
    try {
      const clientId = req.query.clientId;
      const invoices2 = await storage.getInvoices(clientId);
      res.json(invoices2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/invoices/:id", requireAuth, async (req, res) => {
    try {
      const validated = insertInvoiceSchema.partial().parse(req.body);
      const invoice = await storage.updateInvoice(req.params.id, validated);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/invoices/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteInvoice(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/invoices/:id/pdf", async (req, res) => {
    try {
      const { generateInvoicePDF: generateInvoicePDF2 } = await Promise.resolve().then(() => (init_pdf_generator(), pdf_generator_exports));
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      const client = await storage.getClient(invoice.clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      const pdfDoc = generateInvoicePDF2(invoice, client);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`
      );
      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Portal API - Client portal access by portal ID
  app2.get("/api/portal/:portalId", async (req, res) => {
    try {
      const client = await storage.getClientByPortalId(req.params.portalId);
      
      if (!client) {
        return res.status(404).json({ error: "Portal not found" });
      }
      
      // Fetch all related data for the client (last 30 records for portal)
      const facebookMarketingRecords = await storage.getAllFacebookMarketing(client.id, 30, 0);
      const websiteDetails = await storage.getWebsiteDetails(client.id);
      const transactions = await storage.getTransactions(client.id, 30, 0);
      const invoices = await storage.getInvoices(client.id);
      const activeOffers = await storage.getActiveOffers();
      
      // Calculate total top-ups (sum of ALL top-up transactions, not just last 10)
      const allTransactions = await storage.getTransactions(client.id, 999999, 0);
      const topUpTransactions = allTransactions.filter(t => t.type === 'topup');
      const totalTopUps = topUpTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      // Calculate total expense (sum of ALL FB marketing daily spend)
      const allFBMarketing = await storage.getAllFacebookMarketing(client.id, 999999, 0);
      const totalExpense = allFBMarketing.reduce((sum, fb) => sum + parseFloat(fb.dailySpend || 0), 0);
      
      // Return comprehensive portal data with null safety and snake_case aliases for frontend
      // Note: Frontend expects name, email, etc. at root level (not just nested in client)
      res.json({
        // Root level fields for frontend compatibility
        name: client.name,
        email: client.email,
        phone: client.phone,
        companyName: client.companyName,
        balance: client.balance,
        totalTopUps: totalTopUps.toString(),
        total_topups: totalTopUps.toString(), // snake_case alias
        totalTopup: totalTopUps.toString(), // singular alias
        totalExpense: totalExpense.toString(),
        total_expense: totalExpense.toString(), // snake_case alias
        totalCost: totalExpense.toString(), // alternative name
        // Nested client object (kept for compatibility)
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          companyName: client.companyName,
          balance: client.balance,
          totalTopUps: totalTopUps.toString(),
          totalExpense: totalExpense.toString(),
          status: client.status,
          createdAt: client.createdAt,
          created_at: client.createdAt, // snake_case alias for frontend
          portalId: client.portalId
        },
        facebookMarketing: (facebookMarketingRecords || []).map(fb => ({
          ...fb,
          created_at: fb.createdAt // snake_case alias
        })),
        websiteDetails: websiteDetails ? {
          ...websiteDetails,
          created_at: websiteDetails.createdAt, // snake_case alias
          updated_at: websiteDetails.updatedAt  // snake_case alias
        } : null,
        transactions: [
          // Top-up transactions with + formatting
          ...(transactions || [])
            .filter(t => t.type === 'topup')
            .map(t => ({
              ...t,
              created_at: t.createdAt,
              formattedAmount: `+${t.amount}`,
              displayType: 'ব্যালেন্স যোগ'
            })),
          // Synthetic expense transactions from FB marketing (for frontend sum calculation)
          ...(facebookMarketingRecords || []).map(fb => ({
            id: fb.id,
            clientId: fb.clientId,
            type: 'expense',
            amount: fb.dailySpend,
            description: 'Facebook Marketing',
            date: fb.date,
            createdAt: fb.createdAt,
            created_at: fb.createdAt,
            formattedAmount: `-${fb.dailySpend}`,
            displayType: 'মার্কেটিং খরচ'
          }))
        ],
        invoices: invoices || [],
        offers: (activeOffers || []).map(o => ({
          ...o,
          validUntil: o.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: o.createdAt, // snake_case alias
          updated_at: o.updatedAt  // snake_case alias
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app2.get("/api/tags", requireAuth, async (req, res) => {
    try {
      const tags2 = await storage.getTags();
      res.json(tags2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/tags", requireAuth, async (req, res) => {
    try {
      const tag = await storage.createTag(req.body);
      res.status(201).json(tag);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/tags/:id", requireAuth, async (req, res) => {
    try {
      const tag = await storage.updateTag(req.params.id, req.body);
      res.json(tag);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/tags/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteTag(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/clients/:clientId/tags/:tagId", requireAuth, async (req, res) => {
    try {
      const clientTag = await storage.addClientTag(req.params.clientId, req.params.tagId);
      res.status(201).json(clientTag);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/clients/:clientId/tags", async (req, res) => {
    try {
      const clientTags2 = await storage.getClientTags(req.params.clientId);
      res.json(clientTags2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/clients/:clientId/tags/:tagId", requireAuth, async (req, res) => {
    try {
      await storage.removeClientTag(req.params.clientId, req.params.tagId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/offers", async (req, res) => {
    try {
      const offers2 = await storage.getOffers();
      res.json(offers2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/offers/active", async (req, res) => {
    try {
      const offers2 = await storage.getActiveOffers();
      res.json(offers2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/offers", requireAuth, async (req, res) => {
    try {
      const validated = insertOfferSchema.parse(req.body);
      const offer = await storage.createOffer(validated);
      res.status(201).json(offer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/offers/:id", requireAuth, async (req, res) => {
    try {
      const validated = insertOfferSchema.partial().parse(req.body);
      const offer = await storage.updateOffer(req.params.id, validated);
      res.json(offer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/offers/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteOffer(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/quick-messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getQuickMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/quick-messages", requireAuth, async (req, res) => {
    try {
      const validated = insertQuickMessageSchema.parse(req.body);
      const message = await storage.createQuickMessage(validated);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/quick-messages/:id", requireAuth, async (req, res) => {
    try {
      const validated = insertQuickMessageSchema.partial().parse(req.body);
      const message = await storage.updateQuickMessage(req.params.id, validated);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/quick-messages/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteQuickMessage(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Campaign Title Generator
  app2.post("/api/campaign-titles/generate", requireAuth, async (req, res) => {
    try {
      const { clientName, budget, endDate } = req.body;
      
      // Generate campaign title based on client name, budget, and end date
      const budgetFormatted = parseFloat(budget).toFixed(0);
      
      // Parse date safely - handle both ISO string and timestamp
      let dateObj;
      if (typeof endDate === 'string') {
        // If it's a date string, parse it
        dateObj = new Date(endDate.split('T')[0]); // Remove time portion to avoid timezone issues
      } else {
        dateObj = new Date(endDate);
      }
      
      // Use manual month names for Bengali to avoid locale issues
      const bengaliMonths = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const month = bengaliMonths[dateObj.getMonth()];
      const day = dateObj.getDate();
      
      // Bengali campaign title format: "ক্লায়েন্ট নাম - ৫০০০ টাকা - ৩১ অক্টোবর পর্যন্ত"
      const generatedTitle = `${clientName} - ${budgetFormatted} টাকা - ${day} ${month} পর্যন্ত`;
      
      // Save to database with ISO date string
      const campaignTitle = await storage.createCampaignTitle({
        clientName,
        budget: budget.toString(),
        endDate: dateObj,
        generatedTitle
      });
      
      // Return newly created title along with all titles for frontend to display
      const allTitles = await storage.getCampaignTitles();
      res.json({
        ...campaignTitle,
        allTitles: allTitles
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app2.get("/api/campaign-titles", requireAuth, async (req, res) => {
    try {
      const titles = await storage.getCampaignTitles();
      res.json(titles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app2.delete("/api/campaign-titles/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteCampaignTitle(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app2.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.shared-hosting.ts
import path2 from "path";
import fs from "fs";
import session from "express-session";
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'social-ads-expert-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Auth middleware to protect admin routes
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized - Please login' });
};
function log(message) {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [express] ${message}`);
}
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});

// Authentication routes
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    return res.json({ success: true, message: 'Login successful' });
  }
  
  return res.status(401).json({ error: 'Invalid password' });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logout successful' });
  });
});

app.get("/api/admin/check", (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.json({ authenticated: true });
  }
  return res.json({ authenticated: false });
});

(async () => {
  const server = await registerRoutes(app, requireAuth);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath, {
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`\u{1F680} Production server running on port ${port}`);
  });
})();
