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
  };
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

// Core Mock Data
const defaultDealers: Recycler[] = [
  {
    id: "dealer_1",
    businessName: "GreenMetal Recyclers",
    ownerName: "Amit Kumar",
    email: "amit@greenmetal.com",
    phone: "+91 98765 43210",
    address: "Plot 12, Industrial Area Phase 1, New Delhi",
    licenseNumber: "DL-EW-2025-0043",
    ratings: 4.8,
    distance: "1.2 km",
    points: 450,
    services: ["E-Waste Shredding", "Lead Extraction", "Bulk IT Disposal", "Battery Recycling"],
    reviews: [
      { author: "Rajesh S.", rating: 5, text: "Prompt pick up and clean weighing. Received money instantly!", date: "2026-05-15" },
      { author: "Karan Johar", rating: 4, text: "Professional staff, very fast processing of old office desktops.", date: "2026-05-10" }
    ]
  },
  {
    id: "dealer_2",
    businessName: "EcoScrap Traders",
    ownerName: "Sanjay Shah",
    email: "sanjay@ecoscrap.in",
    phone: "+91 91234 56789",
    address: "Shop 45, Kirti Nagar Market, New Delhi",
    licenseNumber: "DL-EW-2024-0988",
    ratings: 4.6,
    distance: "2.8 km",
    points: 320,
    services: ["Household E-Waste", "Copper Reclamation", "Cable Recycling"],
    reviews: [
      { author: "Anjali Gupta", rating: 5, text: "Gave great scrap rates for my dead microwave and old wires.", date: "2026-05-22" }
    ]
  },
  {
    id: "dealer_3",
    businessName: "Varun E-Waste Solutions",
    ownerName: "Varun Prasad",
    email: "varun.ewaste@gmail.com",
    phone: "+91 99999 88888",
    address: "A-54, Okhla Phase 3, New Delhi",
    licenseNumber: "DL-EW-2026-0122",
    ratings: 4.9,
    distance: "3.5 km",
    points: 820,
    services: ["Urban Mining", "Gold & Silver Recovery", "Secure Data Destruction", "Motherboard Processing"],
    reviews: [
      { author: "Vikram R.", rating: 5, text: "The most tech-focused recycler in Delhi. Brilliant setup!", date: "2026-05-25" }
    ]
  },
  {
    id: "dealer_4",
    businessName: "Carbon Buster Recycling",
    ownerName: "Neha Sharma",
    email: "neha@carbonbusters.org",
    phone: "+91 88888 77777",
    address: "Block C, Sector 63, Noida",
    licenseNumber: "UP-EW-2025-8839",
    ratings: 4.5,
    distance: "5.1 km",
    points: 290,
    services: ["Appliance Recycling", "CRT Monitor Safe Disposal", "Plastic Segregation"],
    reviews: [
      { author: "Preeti M.", rating: 4, text: "Very green-focused, they plant a tree for every 10kg collected!", date: "2026-05-20" }
    ]
  }
];

const defaultRefurbishers: Recycler[] = [
  {
    id: "refurb_1",
    businessName: "SmartRebuild Electronics",
    ownerName: "David D'Souza",
    email: "david@smartrebuild.com",
    phone: "+91 95432 10987",
    address: "H-8, Connaught Place Outer Circle, New Delhi",
    licenseNumber: "DL-RF-2024-0012",
    ratings: 4.9,
    distance: "0.8 km",
    points: 620,
    services: ["Smartphone Motherboard Repair", "Screen Refurbishing", "Battery Calibration", "Laptop Upgrades"],
    reviews: [
      { author: "Manish K.", rating: 5, text: "Excellent motherboard soldering quality. Restored my water-damaged phone.", date: "2026-05-20" },
      { author: "Rita Sen", rating: 5, text: "They refurbished my slow laptop by adding an SSD. Fast and efficient!", date: "2026-05-18" }
    ]
  },
  {
    id: "refurb_2",
    businessName: "TechRenew Solutions",
    ownerName: "Rajeev Singhal",
    email: "rajeev@techrenew.in",
    phone: "+91 93210 98765",
    address: "UG-12, District Center, Janakpuri, New Delhi",
    licenseNumber: "DL-RF-2025-0453",
    ratings: 4.7,
    distance: "2.4 km",
    points: 410,
    services: ["Tablet Restoration", "Console Refurbishment", "Display Component Delamination"],
    reviews: [
      { author: "Sumit T.", rating: 4, text: "Professional display laminating, screen looks brand new now.", date: "2026-05-12" }
    ]
  },
  {
    id: "refurb_3",
    businessName: "PhoneFix Eco-Hub",
    ownerName: "Kabir Khan",
    email: "kabir@phonefix.in",
    phone: "+91 98989 77777",
    address: "Shop 102, Gaffar Market, Karol Bagh, New Delhi",
    licenseNumber: "DL-RF-2023-0948",
    ratings: 4.5,
    distance: "3.9 km",
    points: 580,
    services: ["OEM Part Replacement", "Chip Level Board Diagnostics", "Smartwatch Restorations"],
    reviews: [
      { author: "Gaurav D.", rating: 5, text: "They have hard-to-find components. Fixed my Pixel device easily.", date: "2026-05-24" }
    ]
  }
];

const defaultLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Aisha Sharma", points: 280, carbonSaved: 120 },
  { rank: 2, name: "Rohan Mehta", points: 190, carbonSaved: 85 },
  { rank: 3, name: "Priyanka Sen", points: 154, carbonSaved: 68 },
  { rank: 4, name: "Varun Prasad (You)", points: 0, carbonSaved: 0, isCurrentUser: true },
  { rank: 5, name: "Kabir Malhotra", points: 110, carbonSaved: 48 },
  { rank: 6, name: "Divya Teja", points: 94, carbonSaved: 42 }
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
      // Load initial mock bookings
      const initialBookings: Booking[] = [
        {
          id: "bk_1",
          userId: "user_dev",
          userName: "Varun Prasad",
          userPhone: "+91 99999 11111",
          userAddress: "F-122, South Extension Part 2, New Delhi",
          deviceName: "iPhone 11 Pro",
          category: "Smartphone",
          price: 14500,
          status: "completed",
          date: "2026-05-10",
          timeSlot: "10:00 AM - 01:00 PM",
          recyclerId: "refurb_1",
          recyclerName: "SmartRebuild Electronics",
          valuation: {
            deviceName: "iPhone 11 Pro",
            category: "Smartphone",
            age: "Over 2 Years",
            isFunctional: true,
            physicalCondition: "Good",
            batteryCondition: "Good (Above 80%)",
            screenCondition: "Good (Minor Scratches)",
            accessories: ["Box", "Charger"],
            resaleValue: 14500,
            scrapValue: 3500,
            refurbishPossibility: 85,
            canBeRefurbished: true,
            miningYield: { gold: 0.05, copper: 15, silver: 0.25, silicon: 12, plastics: 55 }
          }
        },
        {
          id: "bk_2",
          userId: "user_dev",
          userName: "Varun Prasad",
          userPhone: "+91 99999 11111",
          userAddress: "F-122, South Extension Part 2, New Delhi",
          deviceName: "Dead Samsung LED TV",
          category: "Household Appliance",
          price: 1800,
          status: "pending",
          date: "2026-05-28",
          timeSlot: "02:00 PM - 05:00 PM",
          recyclerId: "dealer_1",
          recyclerName: "GreenMetal Recyclers",
          valuation: {
            deviceName: "Dead Samsung LED TV",
            category: "Household Appliance",
            age: "Over 2 Years",
            isFunctional: false,
            physicalCondition: "Damaged",
            batteryCondition: "Not Applicable",
            screenCondition: "Cracked",
            accessories: [],
            resaleValue: 500,
            scrapValue: 1800,
            refurbishPossibility: 5,
            canBeRefurbished: false,
            miningYield: { gold: 0.02, copper: 150, silver: 0.1, silicon: 35, plastics: 900 }
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
        { id: "msg_1", sender: "bot", text: "Hello! I am EcoBot, your AI recycling guide. How can I help you clear your e-waste today?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ];
      setChatMessages(initialChat);
      localStorage.setItem("scrapsense_chat", JSON.stringify(initialChat));
    }

    if (savedDealers) setDealers(JSON.parse(savedDealers));
    if (savedRefurbishers) setRefurbishers(JSON.parse(savedRefurbishers));
  }, []);

  // Update localStorage helper
  const saveState = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Auth Operations
  const loginUser = async (email: string) => {
    // Standard User Mock login
    const mockUser: User = {
      id: "user_dev",
      name: "Varun Prasad",
      email: email,
      walletBalance: 14500,
      rewardPoints: 2, // 1 item sold previously = 2 points
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      savedLocations: ["F-122, South Extension Part 2, New Delhi"],
      badges: ["Eco Starter"]
    };
    setUser(mockUser);
    setRole("user");
    localStorage.setItem("scrapsense_role", "user");
    saveState("scrapsense_user", mockUser);

    // Sync user in leaderboard
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

    // Reset current user in leaderboard
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
    // If logging in as registered recycler or mock default
    const matchedDefault = [...dealers, ...refurbishers].find(d => d.email.toLowerCase() === email.toLowerCase());
    
    const mockRecycler: Recycler = matchedDefault || {
      id: "recycler_dev",
      businessName: "Varun E-Waste Solutions",
      ownerName: "Varun Prasad",
      email: email,
      phone: "+91 99999 88888",
      address: "A-54, Okhla Phase 3, New Delhi",
      licenseNumber: "DL-EW-2026-0122",
      ratings: 4.9,
      distance: "3.5 km",
      points: 820,
      services: ["Urban Mining", "Gold & Silver Recovery", "Secure Data Destruction", "Motherboard Processing"],
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
      services: services.length > 0 ? services : ["E-waste logistics", "Primary Shredding"],
      reviews: []
    };

    setRecycler(newRecycler);
    setRole("recycler");
    localStorage.setItem("scrapsense_role", "recycler");
    saveState("scrapsense_recycler", newRecycler);

    // Save newly signed-up recycler into the global pool of dealers
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

    // If active user, add location to saved
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

        // Handle points accumulation on success
        if (status === "completed") {
          // If User matches, reward user (1 item sold = 2 reward points)
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

            // Sync user in leaderboard
            const updatedLeaderboard = leaderboard.map(item => {
              if (item.isCurrentUser) {
                return { ...item, points: addedPoints, carbonSaved: addedPoints * 12 };
              }
              return item;
            }).sort((a, b) => b.points - a.points);
            setLeaderboard(updatedLeaderboard);
          }

          // If Recycler matches, reward recycler (1 collection = 3 points)
          if (recycler && b.recyclerId === recycler.id) {
            const updatedRecycler = {
              ...recycler,
              points: recycler.points + 3
            };
            setRecycler(updatedRecycler);
            saveState("scrapsense_recycler", updatedRecycler);

            // Update recycler inside lists too
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

  // Chatbot state
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

    // If message is from user, mock a friendly AI auto-response
    if (sender === "user") {
      setTimeout(() => {
        let reply = "I'm not sure about that. Let me look up your closest recycling center!";
        const query = text.toLowerCase();
        
        if (query.includes("price") || query.includes("worth") || query.includes("value")) {
          reply = "To check your device value, click the 'Get Exact Amount' button in your dashboard. Our AI will analyze your specifications and calculate both its refurbished worth and direct scrap material recovery payout!";
        } else if (query.includes("dealer") || query.includes("recycler") || query.includes("shop")) {
          reply = "You can browse certified scrap dealers under the 'Search Scrap Dealers' tab. All registered partners are e-waste license certified by environmental boards.";
        } else if (query.includes("point") || query.includes("reward") || query.includes("leaderboard")) {
          reply = "Gamification is built right in! Every item you sell gives you 2 reward points which moves you up the carbon leaderboard and unlocks achievement badges. Recyclers get 3 points per successful collection.";
        } else if (query.includes("pickup") || query.includes("order")) {
          reply = "Once you finalize your device valuation, you can book a free door-step pickup. Our agent will verify the physical specs and complete the payout instantly via digital wallet!";
        } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
          reply = "Hello there! Green greetings from ScrapSense. Ask me anything about electronic waste, gold yields, and recycling pickups!";
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

    // Sync leaderboard
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

    // Update in lists
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
