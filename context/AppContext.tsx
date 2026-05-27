"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  rewardPoints: number;
  avatar: string;
  savedLocations: string[];
  badges: string[];
}

export interface Recycler {
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
  services: string[];
  reviews: { author: string; rating: number; text: string; date: string }[];
}

export interface DeviceValuation {
  deviceName: string;
  category: string;
  age: string;
  isFunctional: boolean;
  physicalCondition: string;
  batteryCondition: string;
  screenCondition: string;
  accessories: string[];
  resaleValue: number;
  scrapValue: number;
  refurbishPossibility: number; // 0 to 100
  canBeRefurbished: boolean;
  miningYield: {
    gold: number; // grams
    copper: number; // grams
    silver: number; // grams
    silicon: number; // grams
    plastics: number; // grams
    aluminum: number; // grams
  };
  breakdown: {
    motherboard: number;
    pcb: number;
    battery: number;
    metals: number;
    screen: number;
    storage: number;
  };
  aiExplanation?: string;
  co2SavedKg: number;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  deviceName: string;
  category: string;
  valuation: DeviceValuation;
  recyclerId: string | null;
  recyclerName: string | null;
  price: number;
  status: "pending" | "accepted" | "out_for_pickup" | "completed" | "rejected";
  date: string;
  timeSlot: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  carbonSaved: number; // kg of CO2
  isCurrentUser?: boolean;
}

interface AppContextType {
  user: User | null;
  recycler: Recycler | null;
  role: "user" | "recycler" | null;
  bookings: Booking[];
  chatMessages: ChatMessage[];
  dealers: Recycler[];
  refurbishers: Recycler[];
  leaderboard: LeaderboardEntry[];
  loginUser: (email: string) => Promise<boolean>;
  signupUser: (name: string, email: string) => Promise<boolean>;
  loginRecycler: (email: string) => Promise<boolean>;
  signupRecycler: (businessName: string, ownerName: string, email: string, phone: string, address: string, licenseNumber: string, services: string[]) => Promise<boolean>;
  logout: () => void;
  createBooking: (deviceName: string, valuation: DeviceValuation, address: string, phone: string, timeSlot: string, dealerId: string, isRefurbisher: boolean) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
  addChatMessage: (text: string, sender: "user" | "bot") => void;
  addRewardPoints: (points: number) => void;
  updateUserProfile: (name: string, email: string, address?: string) => void;
  updateRecyclerProfile: (businessName: string, ownerName: string, phone: string, address: string, services: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Core Mock Data matching Stripe/Linear professional tone
const defaultDealers: Recycler[] = [
  {
    id: "dl_1",
    businessName: "EcoRecyclers Industrial Hub",
    ownerName: "Rajesh Singhal",
    email: "contact@ecorecyclers.in",
    phone: "+91 98123 45678",
    address: "Plot 42, Okhla Industrial Area Phase III, New Delhi",
    licenseNumber: "CPCB-EW-2025-9988",
    ratings: 4.8,
    distance: "1.4 km",
    points: 820,
    services: ["E-waste logistics", "PCB shredding", "Lead extraction", "Secure Data Deletion"],
    reviews: [
      { author: "Vikram R.", rating: 5, text: "Extremely professional, certified data wiping, paid locked amount instantly.", date: "2026-05-18" },
      { author: "Karan J.", rating: 4, text: "Excellent industrial scale operations, weight balances are completely clear.", date: "2026-05-10" }
    ]
  },
  {
    id: "dl_2",
    businessName: "Apex Green Mining",
    ownerName: "Sanjay Kumar",
    email: "sanjay@apexgreen.in",
    phone: "+91 99110 88224",
    address: "Block B, Industrial Zone, Sector 63, Noida",
    licenseNumber: "UPPCB-EW-2024-0012",
    ratings: 4.6,
    distance: "4.5 km",
    points: 410,
    services: ["Urban Mining", "PCB Shredding", "Battery Safekeeping"],
    reviews: [
      { author: "Anita S.", rating: 5, text: "Felt very trustworthy. The carbon statement was generated on spot.", date: "2026-05-24" }
    ]
  }
];

const defaultRefurbishers: Recycler[] = [
  {
    id: "rf_1",
    businessName: "Alpha board Refurbishers",
    ownerName: "Dev D'Souza",
    email: "dev@alphaboard.in",
    phone: "+91 98888 77777",
    address: "H-82, CP Outer Circle, Connaught Place, New Delhi",
    licenseNumber: "DL-RF-2025-0199",
    ratings: 4.9,
    distance: "0.8 km",
    points: 930,
    services: ["Display Delamination", "Motherboard Repairs", "Battery Upgrades"],
    reviews: [
      { author: "Manish K.", rating: 5, text: "Micro-soldered MacBook logic board functional again. Brilliant service.", date: "2026-05-22" }
    ]
  }
];

const defaultLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Aisha Sharma", points: 180, carbonSaved: 840 },
  { rank: 2, name: "Rohan Mehta", points: 140, carbonSaved: 620 },
  { rank: 3, name: "Varun Prasad (You)", points: 2, carbonSaved: 24, isCurrentUser: true },
  { rank: 4, name: "Priyanka Sen", points: 90, carbonSaved: 410 }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [recycler, setRecycler] = useState<Recycler | null>(null);
  const [role, setRole] = useState<"user" | "recycler" | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [dealers, setDealers] = useState<Recycler[]>(defaultDealers);
  const [refurbishers, setRefurbishers] = useState<Recycler[]>(defaultRefurbishers);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(defaultLeaderboard);

  // Sync state from LocalStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("scrapsense_user");
    const savedRecycler = localStorage.getItem("scrapsense_recycler");
    const savedRole = localStorage.getItem("scrapsense_role") as "user" | "recycler" | null;
    const savedBookings = localStorage.getItem("scrapsense_bookings");
    const savedChat = localStorage.getItem("scrapsense_chat");
    const savedDealers = localStorage.getItem("scrapsense_dealers");
    const savedRefurbishers = localStorage.getItem("scrapsense_refurbishers");

    if (savedUser && savedRole === "user") {
      setUser(JSON.parse(savedUser));
      setRole("user");
    } else if (savedRecycler && savedRole === "recycler") {
      setRecycler(JSON.parse(savedRecycler));
      setRole("recycler");
    }

    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      const initialBookings: Booking[] = [
        {
          id: "bk_948",
          userId: "user_dev",
          userName: "Varun Prasad",
          userPhone: "+91 99999 11111",
          userAddress: "F-122, South Extension Part 2, New Delhi",
          deviceName: "MacBook Pro M1 (16-inch, 2021)",
          category: "Laptop",
          price: 24500,
          status: "completed",
          date: "2026-05-15",
          timeSlot: "10:00 AM - 01:00 PM",
          recyclerId: "rf_1",
          recyclerName: "Alpha board Refurbishers",
          valuation: {
            deviceName: "MacBook Pro M1 (16-inch, 2021)",
            category: "Laptop",
            age: "Over 2 Years",
            isFunctional: true,
            physicalCondition: "Good",
            batteryCondition: "Good (Above 80%)",
            screenCondition: "Good (Minor Scratches)",
            accessories: ["Original Box", "OEM Charger"],
            resaleValue: 24500,
            scrapValue: 3800,
            refurbishPossibility: 85,
            canBeRefurbished: true,
            co2SavedKg: 44.5,
            miningYield: { gold: 0.14, copper: 92, silver: 0.95, silicon: 55, plastics: 410, aluminum: 650 },
            breakdown: {
              motherboard: 1800,
              pcb: 400,
              battery: 350,
              metals: 750,
              screen: 400,
              storage: 100
            }
          }
        }
      ];
      setBookings(initialBookings);
      localStorage.setItem("scrapsense_bookings", JSON.stringify(initialBookings));
    }

    if (savedChat) {
      setChatMessages(JSON.parse(savedChat));
    } else {
      const initialChat: ChatMessage[] = [
        { id: "msg_1", sender: "bot", text: "Welcome to ScrapSense Business Support. Ask me about certified ISO guidelines, rare metal yields, or doorstep bookings.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ];
      setChatMessages(initialChat);
      localStorage.setItem("scrapsense_chat", JSON.stringify(initialChat));
    }

    if (savedDealers) setDealers(JSON.parse(savedDealers));
    if (savedRefurbishers) setRefurbishers(JSON.parse(savedRefurbishers));
  }, []);

  const saveState = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Auth Operations
  const loginUser = async (email: string) => {
    const mockUser: User = {
      id: "user_dev",
      name: "Varun Prasad",
      email: email,
      walletBalance: 24500,
      rewardPoints: 2,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      savedLocations: ["F-122, South Extension Part 2, New Delhi"],
      badges: ["Eco Starter"]
    };
    setUser(mockUser);
    setRole("user");
    localStorage.setItem("scrapsense_role", "user");
    saveState("scrapsense_user", mockUser);

    const updatedLeaderboard = leaderboard.map(item => {
      if (item.isCurrentUser) {
        return { ...item, points: mockUser.rewardPoints, carbonSaved: mockUser.rewardPoints * 12 };
      }
      return item;
    }).sort((a, b) => b.points - a.points);
    setLeaderboard(updatedLeaderboard);

    return true;
  };

  const signupUser = async (name: string, email: string) => {
    const mockUser: User = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      name: name,
      email: email,
      walletBalance: 0,
      rewardPoints: 0,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
      savedLocations: [],
      badges: []
    };
    setUser(mockUser);
    setRole("user");
    localStorage.setItem("scrapsense_role", "user");
    saveState("scrapsense_user", mockUser);

    const updatedLeaderboard = leaderboard.map(item => {
      if (item.isCurrentUser) {
        return { ...item, name: `${name} (You)`, points: 0, carbonSaved: 0 };
      }
      return item;
    });
    setLeaderboard(updatedLeaderboard);

    return true;
  };

  const loginRecycler = async (email: string) => {
    const matchedDefault = [...dealers, ...refurbishers].find(d => d.email.toLowerCase() === email.toLowerCase());
    
    const mockRecycler: Recycler = matchedDefault || {
      id: "recycler_dev",
      businessName: "EcoRecyclers Industrial Hub",
      ownerName: "Rajesh Singhal",
      email: email,
      phone: "+91 98123 45678",
      address: "Plot 42, Okhla Industrial Area Phase III, New Delhi",
      licenseNumber: "CPCB-EW-2025-9988",
      ratings: 4.8,
      distance: "1.4 km",
      points: 820,
      services: ["E-waste logistics", "PCB shredding", "Lead extraction", "Secure Data Deletion"],
      reviews: [{ author: "Vikram R.", rating: 5, text: "Excellent motherboard extraction and fair price payouts.", date: "2026-05-25" }]
    };

    setRecycler(mockRecycler);
    setRole("recycler");
    localStorage.setItem("scrapsense_role", "recycler");
    saveState("scrapsense_recycler", mockRecycler);
    return true;
  };

  const signupRecycler = async (
    businessName: string,
    ownerName: string,
    email: string,
    phone: string,
    address: string,
    licenseNumber: string,
    services: string[]
  ) => {
    const newRecycler: Recycler = {
      id: "recycler_" + Math.random().toString(36).substring(2, 9),
      businessName,
      ownerName,
      email,
      phone,
      address,
      licenseNumber,
      ratings: 5.0,
      distance: "4.2 km",
      points: 0,
      services: services.length > 0 ? services : ["E-waste logistics", "PCB shredding"],
      reviews: []
    };

    setRecycler(newRecycler);
    setRole("recycler");
    localStorage.setItem("scrapsense_role", "recycler");
    saveState("scrapsense_recycler", newRecycler);

    const updatedDealers = [newRecycler, ...dealers];
    setDealers(updatedDealers);
    saveState("scrapsense_dealers", updatedDealers);

    return true;
  };

  const logout = () => {
    setUser(null);
    setRecycler(null);
    setRole(null);
    localStorage.removeItem("scrapsense_user");
    localStorage.removeItem("scrapsense_recycler");
    localStorage.removeItem("scrapsense_role");
  };

  // Transaction bookings
  const createBooking = (
    deviceName: string,
    valuation: DeviceValuation,
    address: string,
    phone: string,
    timeSlot: string,
    dealerId: string,
    isRefurbisher: boolean
  ) => {
    const listToScan = isRefurbisher ? refurbishers : dealers;
    const partner = listToScan.find(d => d.id === dealerId) || listToScan[0];

    const newBooking: Booking = {
      id: "bk_" + Math.random().toString(36).substring(2, 9),
      userId: user?.id || "anonymous",
      userName: user?.name || "Anonymous User",
      userPhone: phone,
      userAddress: address,
      deviceName,
      category: valuation.category,
      valuation,
      recyclerId: partner.id,
      recyclerName: partner.businessName,
      price: valuation.canBeRefurbished ? valuation.resaleValue : valuation.scrapValue,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      timeSlot
    };

    const newBookingsList = [newBooking, ...bookings];
    setBookings(newBookingsList);
    saveState("scrapsense_bookings", newBookingsList);

    if (user) {
      const savedLocs = user.savedLocations.includes(address) 
        ? user.savedLocations 
        : [...user.savedLocations, address];
      
      const updatedUser = { ...user, savedLocations: savedLocs };
      setUser(updatedUser);
      saveState("scrapsense_user", updatedUser);
    }

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: Booking["status"]) => {
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        const updated = { ...b, status };

        if (status === "completed") {
          if (user && b.userId === user.id) {
            const addedWallet = user.walletBalance + b.price;
            const addedPoints = user.rewardPoints + 2;
            let currentBadges = [...user.badges];
            if (addedPoints >= 4 && !currentBadges.includes("Urban Miner")) {
              currentBadges.push("Urban Miner");
            }
            if (addedPoints >= 8 && !currentBadges.includes("Eco Warrior")) {
              currentBadges.push("Eco Warrior");
            }
            const updatedUser = {
              ...user,
              walletBalance: addedWallet,
              rewardPoints: addedPoints,
              badges: currentBadges
            };
            setUser(updatedUser);
            saveState("scrapsense_user", updatedUser);

            const updatedLeaderboard = leaderboard.map(item => {
              if (item.isCurrentUser) {
                return { ...item, points: addedPoints, carbonSaved: addedPoints * 12 };
              }
              return item;
            }).sort((a, b) => b.points - a.points);
            setLeaderboard(updatedLeaderboard);
          }

          if (recycler && b.recyclerId === recycler.id) {
            const updatedRecycler = {
              ...recycler,
              points: recycler.points + 3
            };
            setRecycler(updatedRecycler);
            saveState("scrapsense_recycler", updatedRecycler);

            const updatedDealers = dealers.map(d => d.id === recycler.id ? { ...d, points: d.points + 3 } : d);
            const updatedRefurbishers = refurbishers.map(r => r.id === recycler.id ? { ...r, points: r.points + 3 } : r);
            setDealers(updatedDealers);
            setRefurbishers(updatedRefurbishers);
            saveState("scrapsense_dealers", updatedDealers);
            saveState("scrapsense_refurbishers", updatedRefurbishers);
          }
        }
        return updated;
      }
      return b;
    });

    setBookings(updatedBookings);
    saveState("scrapsense_bookings", updatedBookings);
  };

  const addChatMessage = (text: string, sender: "user" | "bot") => {
    const newMsg: ChatMessage = {
      id: "msg_" + Math.random().toString(36).substring(2, 9),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMsgsList = [...chatMessages, newMsg];
    setChatMessages(newMsgsList);
    saveState("scrapsense_chat", newMsgsList);

    if (sender === "user") {
      setTimeout(() => {
        let reply = "Our compliance team will review your query shortly.";
        const query = text.toLowerCase();
        
        if (query.includes("price") || query.includes("worth") || query.includes("value")) {
          reply = "ScrapSense operates a hybrid rule-based + AI valuation model. Check pricing directly via the 'AI Valuation' tab for fully detailed component breakdowns.";
        } else if (query.includes("dealer") || query.includes("recycler") || query.includes("shop")) {
          reply = "You can view registered centers on our interactive coordinate radar grids. They are licensed by the Central Pollution Control Board (CPCB).";
        } else if (query.includes("point") || query.includes("reward") || query.includes("leaderboard")) {
          reply = "Each verified collection booking completed adds +2 reward points to your account and reflects directly in the Delhi Carbon Leaderboard.";
        } else if (query.includes("hello") || query.includes("hi")) {
          reply = "Greetings. I am EcoBot, an automated virtual assistant. Let me know if you have questions on e-waste classifications or CPCB guidelines.";
        }

        const botMsg: ChatMessage = {
          id: "msg_" + Math.random().toString(36).substring(2, 9),
          sender: "bot",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updatedMsgs = [...newMsgsList, botMsg];
        setChatMessages(updatedMsgs);
        saveState("scrapsense_chat", updatedMsgs);
      }, 800);
    }
  };

  const addRewardPoints = (points: number) => {
    if (!user) return;
    const updated = {
      ...user,
      rewardPoints: user.rewardPoints + points
    };
    setUser(updated);
    saveState("scrapsense_user", updated);

    const updatedLeaderboard = leaderboard.map(item => {
      if (item.isCurrentUser) {
        return { ...item, points: updated.rewardPoints, carbonSaved: updated.rewardPoints * 12 };
      }
      return item;
    }).sort((a, b) => b.points - a.points);
    setLeaderboard(updatedLeaderboard);
  };

  const updateUserProfile = (name: string, email: string, address?: string) => {
    if (!user) return;
    const locations = address && !user.savedLocations.includes(address)
      ? [...user.savedLocations, address]
      : user.savedLocations;
    
    const updated = {
      ...user,
      name,
      email,
      savedLocations: locations
    };
    setUser(updated);
    saveState("scrapsense_user", updated);

    const updatedLeaderboard = leaderboard.map(item => {
      if (item.isCurrentUser) {
        return { ...item, name: `${name} (You)` };
      }
      return item;
    });
    setLeaderboard(updatedLeaderboard);
  };

  const updateRecyclerProfile = (
    businessName: string,
    ownerName: string,
    phone: string,
    address: string,
    services: string[]
  ) => {
    if (!recycler) return;
    const updated = {
      ...recycler,
      businessName,
      ownerName,
      phone,
      address,
      services
    };
    setRecycler(updated);
    saveState("scrapsense_recycler", updated);

    const updatedDealers = dealers.map(d => d.id === recycler.id ? { ...d, businessName, ownerName, phone, address, services } : d);
    const updatedRefurbishers = refurbishers.map(r => r.id === recycler.id ? { ...r, businessName, ownerName, phone, address, services } : r);
    setDealers(updatedDealers);
    setRefurbishers(updatedRefurbishers);
    saveState("scrapsense_dealers", updatedDealers);
    saveState("scrapsense_refurbishers", updatedRefurbishers);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        recycler,
        role,
        bookings,
        chatMessages,
        dealers,
        refurbishers,
        leaderboard,
        loginUser,
        signupUser,
        loginRecycler,
        signupRecycler,
        logout,
        createBooking,
        updateBookingStatus,
        addChatMessage,
        addRewardPoints,
        updateUserProfile,
        updateRecyclerProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
