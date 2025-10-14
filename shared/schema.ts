import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Clients table - main client information
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  companyName: text("company_name"),
  status: text("status").notNull().default("active"), // active, inactive
  category: text("category").notNull().default("normal"), // normal, website-needed, business-plan-needed, final
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  portalId: varchar("portal_id").notNull().unique().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Facebook Marketing data for each client (daily records)
export const facebookMarketing = pgTable("facebook_marketing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull().defaultNow(),
  dailySpend: decimal("daily_spend", { precision: 10, scale: 2 }).default("0"),
  reach: integer("reach").default(0),
  sales: integer("sales").default(0),
  campaignDetails: text("campaign_details"),
  adAccountId: text("ad_account_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Website details for each client
export const websiteDetails = pgTable("website_details", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Balance transactions - top-ups and expenses
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "topup" or "expense"
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Invoices
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, paid
  lineItems: jsonb("line_items").notNull(), // Array of {description, quantity, rate, amount}
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
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tags - custom labels for clients
export const tags = pgTable("tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("#6B7280"), // hex color code
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Client Tags - many-to-many relationship
export const clientTags = pgTable("client_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  tagId: varchar("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Offers - promotional offers visible on client portal
export const offers = pgTable("offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  validUntil: timestamp("valid_until"),
  isActive: text("is_active").notNull().default("true"), // true, false
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Campaign Titles - generated FB campaign titles
export const campaignTitles = pgTable("campaign_titles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  endDate: timestamp("end_date").notNull(),
  generatedTitle: text("generated_title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Quick Messages - saved messages for quick access (payment details, office address, etc.)
export const quickMessages = pgTable("quick_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  category: text("category").default("general"), // general, payment, address, contact
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const clientsRelations = relations(clients, ({ many, one }) => ({
  facebookMarketing: many(facebookMarketing),
  websiteDetails: one(websiteDetails, {
    fields: [clients.id],
    references: [websiteDetails.clientId],
  }),
  transactions: many(transactions),
  invoices: many(invoices),
  clientTags: many(clientTags),
}));

export const facebookMarketingRelations = relations(facebookMarketing, ({ one }) => ({
  client: one(clients, {
    fields: [facebookMarketing.clientId],
    references: [clients.id],
  }),
}));

export const websiteDetailsRelations = relations(websiteDetails, ({ one }) => ({
  client: one(clients, {
    fields: [websiteDetails.clientId],
    references: [clients.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  client: one(clients, {
    fields: [transactions.clientId],
    references: [clients.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  clientTags: many(clientTags),
}));

export const clientTagsRelations = relations(clientTags, ({ one }) => ({
  client: one(clients, {
    fields: [clientTags.clientId],
    references: [clients.id],
  }),
  tag: one(tags, {
    fields: [clientTags.tagId],
    references: [tags.id],
  }),
}));

// Zod schemas for validation
export const insertClientSchema = createInsertSchema(clients).omit({ 
  id: true, 
  portalId: true, 
  createdAt: true 
});

export const insertFacebookMarketingSchema = createInsertSchema(facebookMarketing).omit({ 
  id: true, 
  createdAt: true 
});

export const insertWebsiteDetailsSchema = createInsertSchema(websiteDetails).omit({ 
  id: true, 
  updatedAt: true 
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ 
  id: true, 
  createdAt: true 
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({ 
  id: true, 
  createdAt: true 
}).extend({
  invoiceNumber: z.string().optional(),
  issueDate: z.coerce.date().optional(),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  workStartDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  workEndDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  discountPercent: z.string().or(z.number()).transform(String).optional(),
  vatPercent: z.string().or(z.number()).transform(String).optional(),
});

export const insertTagSchema = createInsertSchema(tags).omit({ 
  id: true, 
  createdAt: true 
});

export const insertClientTagSchema = createInsertSchema(clientTags).omit({ 
  id: true, 
  createdAt: true 
});

export const insertOfferSchema = createInsertSchema(offers).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true 
}).extend({
  validUntil: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

export const insertCampaignTitleSchema = createInsertSchema(campaignTitles).omit({ 
  id: true, 
  createdAt: true 
}).extend({
  endDate: z.coerce.date(),
});

export const insertQuickMessageSchema = createInsertSchema(quickMessages).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true 
});

// Types
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type FacebookMarketing = typeof facebookMarketing.$inferSelect;
export type InsertFacebookMarketing = z.infer<typeof insertFacebookMarketingSchema>;

export type WebsiteDetails = typeof websiteDetails.$inferSelect;
export type InsertWebsiteDetails = z.infer<typeof insertWebsiteDetailsSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type ClientTag = typeof clientTags.$inferSelect;
export type InsertClientTag = z.infer<typeof insertClientTagSchema>;

export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;

export type CampaignTitle = typeof campaignTitles.$inferSelect;
export type InsertCampaignTitle = z.infer<typeof insertCampaignTitleSchema>;

export type QuickMessage = typeof quickMessages.$inferSelect;
export type InsertQuickMessage = z.infer<typeof insertQuickMessageSchema>;

// Combined types
export type ClientWithDetails = Client & {
  facebookMarketing?: FacebookMarketing[];
  websiteDetails?: WebsiteDetails;
  transactions?: Transaction[];
  invoices?: Invoice[];
  tags?: (ClientTag & { tag: Tag })[];
};

export type ClientWithTags = Client & {
  tags?: Tag[];
};
