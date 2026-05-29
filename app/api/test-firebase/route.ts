import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
    try {
        const docRef = await addDoc(collection(db, "test"), {
            message: "Firebase connected successfully",
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            id: docRef.id,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        });
    }
}