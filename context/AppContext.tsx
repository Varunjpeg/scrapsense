"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  email: string;
  role: "customer" | "recycler" | "refurbisher";
  rewardPoints: number;
  walletBalance: number;
  avatar: string;
  savedLocations: string[];
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
  role: "customer" | "recycler" | "refurbisher" | null;
  bookings: Booking[];
  chatMessages: ChatMessage[];
  dealers: Recycler[];
  refurbishers: Recycler[];
  leaderboard: LeaderboardEntry[];
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signupSendOtp: (email: string) => Promise<{ success: boolean; otp?: string; error?: string }>;
  signupVerifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  signupComplete: (userData: { name: string; age: number; phone: string; address: string; email: string; password: string; role: "customer" | "recycler" | "refurbisher" }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  createBooking: (deviceName: string, valuation: DeviceValuation, address: string, phone: string, timeSlot: string, dealerId: string, isRefurbisher: boolean) => Promise<Booking | null>;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => Promise<void>;
  addChatMessage: (text: string, sender: "user" | "bot") => void;
  addRewardPoints: (points: number) => void;
  updateUserProfile: (name: string, age: number, phone: string, address: string, avatar?: string) => Promise<boolean>;
  updateRecyclerProfile: (businessName: string, ownerName: string, phone: string, address: string, services: string[]) => void;
  searchNearbyRecyclers: (city: string) => Promise<{ dealers: Recycler[]; refurbishers: Recycler[] }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Aisha Sharma", points: 180, carbonSaved: 840 },
  { rank: 2, name: "Rohan Mehta", points: 140, carbonSaved: 620 },
  { rank: 3, name: "Varun Prasad (You)", points: 2, carbonSaved: 24, isCurrentUser: true },
  { rank: 4, name: "Priyanka Sen", points: 90, carbonSaved: 410 }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [recycler, setRecycler] = useState<Recycler | null>(null);
  const [role, setRole] = useState<"customer" | "recycler" | "refurbisher" | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [dealers, setDealers] = useState<Recycler[]>([]);
  const [refurbishers, setRefurbishers] = useState<Recycler[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(defaultLeaderboard);

  // Sync session and fetch persistent database records on mount
  useEffect(() => {
    const fetchSessionAndData = async () => {
      try {
        // Load initial chat messages
        const savedChat = localStorage.getItem("scrapsense_chat");
        if (savedChat) {
          setChatMessages(JSON.parse(savedChat));
        } else {
          const initialChat: ChatMessage[] = [
            { id: "msg_1", sender: "bot", text: "Welcome to ScrapSense Business Support. Ask me about certified ISO guidelines, rare metal yields, or doorstep bookings.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ];
          setChatMessages(initialChat);
        }

        // Fetch active DB session
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        
        if (sessionData.success && sessionData.session) {
          const activeSession = sessionData.session;
          if (activeSession.role === "customer") {
            setUser(activeSession);
            setRole("customer");
          } else {
            setRecycler(activeSession);
            setRole(activeSession.role);
          }

          // Fetch bookings and recyclers from persistent DB
          const bookingsRes = await fetch(`/api/bookings?role=${activeSession.role}&id=${activeSession.id}`);
          const bookingsData = await bookingsRes.json();
          if (bookingsData.success) {
            setBookings(bookingsData.bookings);
          }
        }

        // Fetch standard nearby dealers/refurbishers
        const searchRes = await fetch("/api/recyclers/search?query=Delhi");
        const searchData = await searchRes.json();
        if (searchData.success) {
          setDealers(searchData.dealers);
          setRefurbishers(searchData.refurbishers);
        }

      } catch (error) {
        console.error("Failed to load full-stack session:", error);
      }
    };

    fetchSessionAndData();
  }, []);

  // Secure credential authentication against SQLite DB
  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.success) {
        if (data.user.role === "customer") {
          setUser(data.user);
          setRole("customer");
        } else {
          setRecycler(data.user);
          setRole(data.user.role);
        }

        // Fetch bookings for logged-in user
        const bookingsRes = await fetch(`/api/bookings?role=${data.user.role}&id=${data.user.id}`);
        const bookingsData = await bookingsRes.json();
        if (bookingsData.success) {
          setBookings(bookingsData.bookings);
        }

        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  // OTP Signup Wizards
  const signupSendOtp = async (email: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, email })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, error: "Network error sending OTP." };
    }
  };

  const signupVerifyOtp = async (email: string, otp: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 2, email, otp })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, error: "Network error verifying OTP." };
    }
  };

  const signupComplete = async (userData: any) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 3, ...userData })
      });
      const data = await response.json();
      
      if (data.success) {
        if (data.user.role === "customer") {
          setUser(data.user);
          setRole("customer");
        } else {
          setRecycler(data.user);
          setRole(data.user.role);
        }
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: "Failed to finalize database registration." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      setUser(null);
      setRecycler(null);
      setRole(null);
      setBookings([]);
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };

  // Relational Database Geolocation discovery using OpenStreetMap Nominatim
  const searchNearbyRecyclers = async (city: string) => {
    try {
      const response = await fetch(`/api/recyclers/search?query=${encodeURIComponent(city)}`);
      const data = await response.json();
      if (data.success) {
        setDealers(data.dealers);
        setRefurbishers(data.refurbishers);
        return { dealers: data.dealers, refurbishers: data.refurbishers };
      }
      return { dealers: [], refurbishers: [] };
    } catch (err) {
      console.error("OSM locator failed:", err);
      return { dealers: [], refurbishers: [] };
    }
  };

  // DB persistent bookings booking
  const createBooking = async (
    deviceName: string,
    valuation: DeviceValuation,
    address: string,
    phone: string,
    timeSlot: string,
    dealerId: string,
    isRefurbisher: boolean
  ) => {
    if (!user) return null;
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userPhone: phone,
          userAddress: address,
          deviceName,
          category: valuation.category,
          price: valuation.canBeRefurbished ? valuation.resaleValue : valuation.scrapValue,
          timeSlot,
          recyclerId: dealerId,
          valuation
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setBookings(prev => [data.booking, ...prev]);
        
        // Update local user saved locations if new
        if (!user.savedLocations.includes(address)) {
          const locs = [...user.savedLocations, address];
          setUser({ ...user, savedLocations: locs });
        }
        
        return data.booking;
      }
      return null;
    } catch (error) {
      console.error("Create booking failed:", error);
      return null;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking["status"]) => {
    try {
      const response = await fetch("/api/bookings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status })
      });
      const data = await response.json();

      if (data.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
        
        // Sync active user balance/points if completed
        if (status === "completed") {
          if (user && data.user) {
            setUser({
              ...user,
              walletBalance: data.user.walletBalance,
              rewardPoints: data.user.rewardPoints
            });
            // Update leaderboard
            setLeaderboard(prev => prev.map(l => l.isCurrentUser ? { ...l, points: data.user.rewardPoints, carbonSaved: data.user.rewardPoints * 12 } : l).sort((a,b) => b.points - a.points));
          }
          if (recycler && data.recycler) {
            setRecycler({
              ...recycler,
              points: data.recycler.points
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
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
    localStorage.setItem("scrapsense_chat", JSON.stringify(newMsgsList));

    if (sender === "user") {
      setTimeout(() => {
        let reply = "Our compliance team will review your e-waste inquiry shortly.";
        const query = text.toLowerCase();
        
        if (query.includes("price") || query.includes("worth") || query.includes("value")) {
          reply = "Valuations are driven by Google Gemini Vision. Check locked payouts under 'AI Valuation' for comprehensive detailed copper/gold component breakdowns.";
        } else if (query.includes("dealer") || query.includes("recycler") || query.includes("shop")) {
          reply = "ScrapSense discovery connects to real Nominatim APIs. Search your city to locate certified nearby scrap hubs instantly.";
        } else if (query.includes("point") || query.includes("reward") || query.includes("leaderboard")) {
          reply = "Diverting items adds +2 carbon points to your profile permanently, unlocking achievement badges and climbing the regional leaderboard.";
        } else if (query.includes("hello") || query.includes("hi")) {
          reply = "Greetings. I am EcoBot, your automated sustainability guide. Let me know if you need help with CPCB classifications or doorstep schedules.";
        }

        const botMsg: ChatMessage = {
          id: "msg_" + Math.random().toString(36).substring(2, 9),
          sender: "bot",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updatedMsgs = [...newMsgsList, botMsg];
        setChatMessages(updatedMsgs);
        localStorage.setItem("scrapsense_chat", JSON.stringify(updatedMsgs));
      }, 800);
    }
  };

  const addRewardPoints = (points: number) => {
    if (!user) return;
    setUser({ ...user, rewardPoints: user.rewardPoints + points });
  };

  // Permanent SQLite DB profile updates
  const updateUserProfile = async (name: string, age: number, phone: string, address: string, avatar?: string) => {
    if (!user) return false;
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, name, age, phone, address, avatar })
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Update profile API failed:", err);
      return false;
    }
  };

  const updateRecyclerProfile = (
    businessName: string,
    ownerName: string,
    phone: string,
    address: string,
    services: string[]
  ) => {
    // handled locally or synced
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
        signupSendOtp,
        signupVerifyOtp,
        signupComplete,
        logout,
        createBooking,
        updateBookingStatus,
        addChatMessage,
        addRewardPoints,
        updateUserProfile,
        updateRecyclerProfile,
        searchNearbyRecyclers
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
