"use client";

import { useEffect, useState } from "react";
import ProfileList from "@/components/ProfileList";
import WebService from "@/api/WebService";
import { apiGET } from "@/api/apiMethods";
import { useRouter } from "next/navigation";

interface Metric {
    id: number;
    name: string;
    description: string;
    weight: number;
}

export default function Home() {

}