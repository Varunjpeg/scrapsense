import fs from "fs";
import path from "path";
import crypto from "crypto";

// Path to persistent server-side JSON relational database
const DB_FILE = path.join(process.cwd(), "scrapsense_database.json");

export interface DBUser {
  id: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: "customer" | "recycler" | "refurbisher";
  rewardPoints: number;
  walletBalance: number;
  avatar: string;
  verified: boolean;
}

export interface DBOtp {
  email: string;
  otp: string;
  expiresAt: number;
}

export interface DBBooking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  deviceName: string;
  category: string;
  price: number;
  status: "pending" | "accepted" | "out_for_pickup" | "completed" | "rejected";
  date: string;
  timeSlot: string;
  recyclerId: string | null;
  recyclerName: string | null;
  valuationJson: string; // detailed pricing breakdown & yields
}

export interface DBRecycler {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  ratings: number;
  distance: string;
  points: number;
  servicesJson: string;
  isRefurbisher: boolean;
}

interface DatabaseSchema {
  users: DBUser[];
  otps: DBOtp[];
  bookings: DBBooking[];
  recyclers: DBRecycler[];
}

// Initial Core Recycler Seed Data matching Zerodha/Cashify trustworthy aesthetic
const SEED_RECYCLERS: DBRecycler[] = [
  {
    id: "rec_1",
    businessName: "EcoRecyclers Industrial Hub",
    ownerName: "Rajesh Singhal",
    email: "contact@ecorecyclers.in",
    phone: "+91 98123 45678",
    address: "Plot 42, Okhla Industrial Area Phase III, New Delhi",
    licenseNumber: "CPCB-EW-2025-9988",
    ratings: 4.8,
    distance: "1.4 km",
    points: 820,
    servicesJson: JSON.stringify(["E-waste Logistics", "PCB Shredding", "Lead Extraction", "Secure Data Deletion"]),
    isRefurbisher: false
  },
  {
    id: "rec_2",
    businessName: "Apex Green Metals",
    ownerName: "Sanjay Kumar",
    email: "sanjay@apexgreen.in",
    phone: "+91 99110 88224",
    address: "Block B, Industrial Zone, Sector 63, Noida",
    licenseNumber: "UPPCB-EW-2024-0012",
    ratings: 4.6,
    distance: "4.5 km",
    points: 410,
    servicesJson: JSON.stringify(["Urban Mining", "PCB Shredding", "Battery Safekeeping"]),
    isRefurbisher: false
  },
  {
    id: "ref_1",
    businessName: "Alpha Board Refurbishers",
    ownerName: "Dev D'Souza",
    email: "dev@alphaboard.in",
    phone: "+91 98888 77777",
    address: "H-82, CP Outer Circle, Connaught Place, New Delhi",
    licenseNumber: "DL-RF-2025-0199",
    ratings: 4.9,
    distance: "0.8 km",
    points: 930,
    servicesJson: JSON.stringify(["Display Delamination", "Motherboard Repairs", "Battery Upgrades"]),
    isRefurbisher: true
  }
];

class DatabaseManager {
  private data: DatabaseSchema = {
    users: [],
    otps: [],
    bookings: [],
    recyclers: []
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        // Seed initial data
        this.data.recyclers = SEED_RECYCLERS;
        this.save();
      }
    } catch (error) {
      console.error("Failed to initialize database file:", error);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      console.error("Failed to write to database file:", error);
    }
  }

  // --- CRYPTO UTILITIES ---
  public hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  }

  public generateSalt(): string {
    return crypto.randomBytes(16).toString("hex");
  }

  // --- USER API ---
  public getUsers(): DBUser[] {
    this.init();
    return this.data.users;
  }

  public getUserByEmail(email: string): DBUser | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): DBUser | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  public createUser(user: Omit<DBUser, "id" | "rewardPoints" | "walletBalance" | "avatar" | "verified">): DBUser {
    this.init();
    const id = "usr_" + crypto.randomBytes(8).toString("hex");
    const newUser: DBUser = {
      ...user,
      id,
      rewardPoints: 0,
      walletBalance: 0,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
      verified: true
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUserProfile(id: string, name: string, age: number, phone: string, address: string, avatar?: string): DBUser | null {
    this.init();
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    this.data.users[index] = {
      ...this.data.users[index],
      name,
      age,
      phone,
      address,
      avatar: avatar || this.data.users[index].avatar
    };

    this.save();
    return this.data.users[index];
  }

  public updateUserPointsAndWallet(id: string, rewardPoints: number, walletBalance: number): DBUser | null {
    this.init();
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    this.data.users[index] = {
      ...this.data.users[index],
      rewardPoints,
      walletBalance
    };

    this.save();
    return this.data.users[index];
  }

  // --- OTP API ---
  public saveOtp(email: string, otp: string) {
    this.init();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    const index = this.data.otps.findIndex(o => o.email.toLowerCase() === email.toLowerCase());
    
    if (index !== -1) {
      this.data.otps[index] = { email, otp, expiresAt };
    } else {
      this.data.otps.push({ email, otp, expiresAt });
    }
    
    this.save();
  }

  public verifyOtp(email: string, otp: string): boolean {
    this.init();
    const index = this.data.otps.findIndex(
      o => o.email.toLowerCase() === email.toLowerCase() && o.otp === otp && o.expiresAt > Date.now()
    );
    if (index !== -1) {
      // Consume OTP
      this.data.otps.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // --- RECYCLER API ---
  public getRecyclers(): DBRecycler[] {
    this.init();
    return this.data.recyclers;
  }

  public getRecyclerByEmail(email: string): DBRecycler | undefined {
    return this.getRecyclers().find(r => r.email.toLowerCase() === email.toLowerCase());
  }

  public createRecycler(recycler: Omit<DBRecycler, "id" | "ratings" | "distance" | "points">): DBRecycler {
    this.init();
    const id = "rec_" + crypto.randomBytes(8).toString("hex");
    const newRec: DBRecycler = {
      ...recycler,
      id,
      ratings: 5.0,
      distance: "2.5 km",
      points: 0
    };
    this.data.recyclers.push(newRec);
    this.save();
    return newRec;
  }

  public updateRecyclerPoints(id: string, points: number): DBRecycler | null {
    this.init();
    const index = this.data.recyclers.findIndex(r => r.id === id);
    if (index === -1) return null;

    this.data.recyclers[index].points = points;
    this.save();
    return this.data.recyclers[index];
  }

  // --- BOOKINGS API ---
  public getBookings(): DBBooking[] {
    this.init();
    return this.data.bookings;
  }

  public createBooking(booking: Omit<DBBooking, "id">): DBBooking {
    this.init();
    const id = "bk_" + crypto.randomBytes(8).toString("hex");
    const newBooking: DBBooking = {
      ...booking,
      id
    };
    this.data.bookings.push(newBooking);
    this.save();
    return newBooking;
  }

  public updateBookingStatus(id: string, status: DBBooking["status"]): DBBooking | null {
    this.init();
    const index = this.data.bookings.findIndex(b => b.id === id);
    if (index === -1) return null;

    this.data.bookings[index].status = status;
    this.save();
    return this.data.bookings[index];
  }
}

export const db = new DatabaseManager();
