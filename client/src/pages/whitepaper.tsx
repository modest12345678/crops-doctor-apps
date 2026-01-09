import { useLanguage } from "@/lib/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText, Leaf, Sprout, ShieldCheck, Globe, Code, User, Mail,
    MessageCircle, CloudSun, MapPin, ScanLine, Database, BookOpen, Linkedin
} from "lucide-react";

export default function Whitepaper() {
    const { language } = useLanguage();

    const content = {
        en: {
            title: "Crop Doctor AI: The Future of Smart Agriculture",
            subtitle: "Technical Whitepaper v3.0 | Extended Edition",
            sections: [
                {
                    title: "1. Introduction",
                    icon: FileText,
                    text: "Crop Doctor AI is an integrated Digital Agriculture Platform designed to address the critical challenges of food security, climate change, and farmer profitability. By converging five cutting-edge technologies—Computer Vision, Satellite Remote Sensing, Generative AI, IoT, and Blockchain-ready Traceability—we provide a holistic solution that supports the farmer from 'Seed to Sale'."
                },
                {
                    title: "2. Comprehensive Tool Deep-Dive",
                    icon: Code,
                    text: "Our ecosystem consists of six specialized modules. Below is a detailed technical and operational breakdown of each.",
                    subsections: [
                        {
                            title: "A. AI Disease Detector (Computer Vision)",
                            text: "• Technical Core: Powered by a fine-tuned Convolutional Neural Network (CNN) trained on over 50,000 labeled images of crop diseases (e.g., PlantVillage dataset). It uses transfer learning for high accuracy even on low-end mobile cameras.\n• Operational Workflow: The farmer captures a leaf image -> Image is pre-processed (noise reduction) -> AI model analyzes texture and color patterns -> Returns diagnosis (e.g., 'Late Blight') with a confidence score -> Suggests approved chemical and organic remedies.\n• Agricultural Impact: Facilitates 'Integrated Pest Management (IPM)'. By enabling early detection, it prevents outbreaks from spreading to neighboring fields, reducing crop loss by an estimated 35-40%."
                        },
                        {
                            title: "B. Soil Fertility Index (Satellite Remote Sensing)",
                            text: "• Technical Core: Integrates Sentinel-2 multispectral satellite imagery with OpenSoil APIs. It analyzes spectral bands (Near-Infrared, Red Edge) to estimate soil organic carbon and moisture levels based on the user's precise GPS coordinates.\n• Operational Workflow: User requests 'Get Location' -> App fetches lat/long -> Queries satellite data interactively -> Returns estimated status of Nitrogen (N), Phosphorus (P), Potassium (K), and pH.\n• Agricultural Impact: Enables 'Variable Rate Technology (VRT)' awareness. Farmers understand their soil's spatial variability without expensive grid sampling, promoting soil regeneration."
                        },
                        {
                            title: "C. Fertilizer Calculator (Precision Algorithmic Logic)",
                            text: "• Technical Core: A deterministic algorithm engine based on the official fertilizer recommendation guides of the BARC (Bangladesh Agricultural Research Council). It supports unit conversion (decimals to hectares) and nutrient balancing.\n• Operational Workflow: Farmer inputs crop type (e.g., Rice), growth stage, and land area -> Algorithm calculates total nutrient requirement -> Converts requirement into commercial fertilizer bags (Urea, TSP, MoP, Gypsum).\n• Agricultural Impact: Prevents 'Nutrient Runoff' and Eutrophication. Accurate dosing saves farmers money (approx. 2000-5000 BDT per season) and prevents chemical burning of crops."
                        },
                        {
                            title: "D. AI Chat Assistant (Polyglot Agronomist)",
                            text: "• Technical Core: Built on a Large Language Model (LLM) fine-tuned on agricultural extension manuals. It features a 'Retrieval-Augmented Generation (RAG)' layer to fetch real-time market prices and weather data.\n• Operational Workflow: User speaks or types in Bangla/English -> Speech-to-Text converts audio -> LLM processes query -> Search tool retrieves context -> Text-to-Speech delivers advice.\n• Agricultural Impact: Solves the 'Extension Officer Gap'. With a ratio of 1 officer to 2000 farmers in many developing nations, this AI provides instant, 24/7 expert consultation."
                        },
                        {
                            title: "E. Weather Forecast (Hyper-local Prediction)",
                            text: "• Technical Core: Connects to global meteorological APIs (e.g., OpenWeatherMap) to provide micro-climate data. It monitors parameters like precipitation probability, wind speed, and humidity.\n• Operational Workflow: Automatically detects user location -> Displays 5-day forecast -> Triggers alerts for extreme events (Cyclones, Droughts).\n• Agricultural Impact: Enables 'Climate-Smart Agriculture'. Farmers can synchronize activities (e.g., spraying pesticides only when wind speed is low, harvesting before rain) to maximize efficiency."
                        },
                        {
                            title: "F. Farm-to-Fork Traceability",
                            text: "• Technical Core: A distributed ledger-style database that records immutable 'events' in a crop's lifecycle. It generates a unique cryptographic hash for each harvest batch, encoded into a QR code.\n• Operational Workflow: Farmer logs 'Sowing' with date -> Logs 'Fertilizing' with inputs used -> Logs 'Harvest' with yield -> System generates QR code -> Consumer scans to see the timeline.\n• Agricultural Impact: Ensures 'Food Safety & Compliance'. It opens export markets (e.g., Europe/USA) where traceability is mandatory, allowing farmers to earn a premium of 20-30%."
                        }
                    ]
                },
                {
                    title: "3. Impact on Modern Agriculture",
                    icon: Globe,
                    text: "Crop Doctor AI fundamentally shifts the agricultural paradigm:",
                    subsections: [
                        {
                            title: "Efficiency & Yield Maximization",
                            text: "By treating the farm as a data-driven factory, we minimize the 'Guesswork Gap'. Precision inputs lead to maximum physiological growth of crops."
                        },
                        {
                            title: "Environmental Sustainability",
                            text: "Targeted application of chemicals reduces the ecological footprint. Healthy soil sequester more carbon, helping to fight climate change."
                        },
                        {
                            title: "Socio-Economic Empowerment",
                            text: "Knowledge is power. By arming smallholder farmers with satellite data and AI, we level the playing field against large industrial farms."
                        }
                    ]
                },
                {
                    title: "4. Developer Details",
                    icon: User,
                    text: "Innovated and engineered by a dedicated agricultural technologist.",
                    image: "/developer.jpg",
                    subsections: [
                        {
                            title: "Lead Developer",
                            text: "Name: Madesh Chakma\nEducation: B.Sc in Agricultural Engineering, Hajee Mohammad Danesh Science and Technology University (HSTU)\nRole: CEO & AI Architect\nFocus: Bridging the gap between Silicon Valley tech and rural Bangladesh. Expert in Full-Stack Development (React/Node), Geospatial Analysis, and AI Model Deployment."
                        },
                        {
                            title: "Development Philosophy",
                            text: "Our philosophy is rooted in 'Technology for All'. We strive to create sophisticated yet accessible solutions that bridge the gap between traditional farming and modern innovation, ensuring that every farmer, regardless of their background, can harness the power of AI to transform their livelihood."
                        }
                    ]
                },
                {
                    title: "5. Contact & Collaboration",
                    icon: Mail,
                    text: "We are actively seeking partnerships with Government Extension Agencies, NGOs, and Agri-Input Companies.",
                    subsections: [
                        {
                            title: "Email",
                            text: "madeshchakma@gmail.com"
                        },
                        {
                            title: "LinkedIn",
                            text: "https://www.linkedin.com/in/madeshchakma"
                        },
                        {
                            title: "Address",
                            text: "Dinajpur, Bangladesh"
                        }
                    ]
                }
            ]
        },
        bn: {
            title: "ক্রপ ডক্টর এআই: আধুনিক কৃষির ভবিষ্যৎ",
            subtitle: "টেকনিক্যাল হোয়াইটপেপার ৩.০ | বিস্তারিত সংস্করণ",
            sections: [
                {
                    title: "১. ভূমিকা (Introduction)",
                    icon: FileText,
                    text: "ক্রপ ডক্টর এআই একটি সমন্বিত ডিজিটাল কৃষি প্ল্যাটফর্ম যা খাদ্য নিরাপত্তা, জলবায়ু পরিবর্তন এবং কৃষকের লাভ নিশ্চিত করতে তৈরি। কম্পিউটার ভিশন, স্যাটেলাইট রিমোট সেন্সিং, জেনারেটিভ এআই এবং ট্রেসেবিলিটি প্রযুক্তির সমন্বয়ে আমরা 'বীজ থেকে বাজার' পর্যন্ত কৃষকের পাশে থাকি।"
                },
                {
                    title: "২. টুলস এবং প্রযুক্তির বিস্তারিত বিবরণ",
                    icon: Code,
                    text: "আমাদের ইকোসিস্টেমে ৬টি বিশেষায়িত মডিউল রয়েছে। নিচে প্রতিটির কারিগরি ও ব্যবহারিক বিবরণ দেওয়া হলো।",
                    subsections: [
                        {
                            title: "ক. এআই রোগ শনাক্তকারী (Computer Vision)",
                            text: "• প্রযুক্তি: এটি একটি শক্তিশালী কনভোলিউশনাল নিউরাল নেটওয়ার্ক (CNN) যা ৫০,০০০+ রোগের ছবির ওপর প্রশিক্ষিত। এটি কম দামী মোবাইল ক্যামেরাতেও নিখুঁতভাবে কাজ করে।\n• ব্যবহার প্রক্রিয়া: কৃষক পাতার ছবি তোলেন -> এআই ছবির টেক্সচার ও রঙ বিশ্লেষণ করে -> তাৎক্ষণিক রোগ নির্ণয় করে (যেমন: লেট ব্লাইট) -> রাসায়নিক ও জৈব দমনের পরামর্শ দেয়।\n• কৃষিতে প্রভাব: এটি 'সমন্বিত বালাই ব্যবস্থাপনা (IPM)' সহজ করে। শুরুতে রোগ শনাক্ত করায় ফসলের ক্ষতি ৩৫-৪০% কমে এবং অপ্রয়োজনীয় বিষ প্রয়োগ বন্ধ হয়।"
                        },
                        {
                            title: "খ. মাটির উর্বরতা সূচক (Satellite Remote Sensing)",
                            text: "• প্রযুক্তি: সেন্টিনেল-২ স্যাটেলাইট এবং ওপেন-সয়েল এপিআই ব্যবহার করে এটি মহাকাশ থেকে মাটির রঙের তরঙ্গ বিশ্লেষণ করে। জিপিএস ব্যবহার করে এটি মাটির জৈব উপাদান বুঝতে পারে।\n• ব্যবহার প্রক্রিয়া: 'Get Location' এ ক্লিক করুন -> অ্যাপ স্যাটেলাইট ডাটা প্রসেস করবে -> নাইট্রোজেন, ফসফরাস, পটাশিয়াম এবং পিএইচ (pH) এর সম্ভাব্য মাত্রা দেখাবে।\n• কৃষিতে প্রভাব: ব্যয়বহুল ল্যাব টেস্ট ছাড়াই এটি 'প্রিসিশন এগ্রিকালচার' বা নিখুঁত কৃষি নিশ্চিত করে। কৃষক মাটির স্বাস্থ্য বুঝে সঠিক পদক্ষেপ নিতে পারেন।"
                        },
                        {
                            title: "গ. ফার্টিলাইজার ক্যালকুলেটর (Precision Algorithm)",
                            text: "• প্রযুক্তি: বাংলাদেশ কৃষি গবেষণা কাউন্সিল (BARC) এর সার সুপারিশমালার ওপর ভিত্তি করে তৈরি একটি অ্যালগরিদম ইঞ্জিন। এটি জমির একক (শতাংশ/বিঘা/হেক্টর) স্বয়ংক্রিয়ভাবে রূপান্তর করতে পারে।\n• ব্যবহার প্রক্রিয়া: কৃষক ফসলের নাম, বয়স এবং জমির পরিমাণ দেন -> অ্যালগরিদম পুষ্টির চাহিদা হিসাব করে -> ইউরিয়া, টিএসপি, এমওপি, জিপসাম সারের সঠিক পরিমাণ কেজিতে বলে দেয়।\n• কৃষিতে প্রভাব: এটি মাটির বিষক্রিয়া ও অপচয় রোধ করে। সঠিক মাত্রায় সার দিলে প্রতি মৌসুমে কৃষকের ২০০০-৫০০০ টাকা সাশ্রয় হয়।"
                        },
                        {
                            title: "ঘ. এআই চ্যাট অ্যাসিস্ট্যান্ট (Polyglot Agronomist)",
                            text: "• প্রযুক্তি: লার্জ ল্যাঙ্গুয়েজ মডেল (LLM) ভিত্তিক একটি চ্যাটবট যা কৃষি বই ও তথ্যের ওপর প্রশিক্ষিত। এটি রিয়েল-টাইম মার্কেট প্রাইস বা আবহাওয়ার তথ্যও দিতে সক্ষম।\n• ব্যবহার প্রক্রিয়া: কৃষক বাংলা বা ইংরেজিতে প্রশ্ন করেন (ভয়েস বা টেক্সট) -> এআই প্রশ্ন বুঝে বৈজ্ঞানিক কিন্তু সহজ ভাষায় উত্তর দেয়।\n• কৃষিতে প্রভাব: দেশে কৃষি কর্মকর্তার অভাব (প্রতি ২০০০ কৃষকে ১ জন) পূরণ করে। এটি কৃষকের পকেটে থাকা ২৪/৭ কৃষি বিশেষজ্ঞ।"
                        },
                        {
                            title: "ঙ. আবহাওয়ার পূর্বাভাস (Hyper-local Forecast)",
                            text: "• প্রযুক্তি: গ্লোবাল মেটিওরোলজিক্যাল এপিআই এর সাথে সংযুক্ত হয়ে এটি সুনির্দিষ্ট এলাকার মাইক্রো-ক্লাইমেট ডাটা প্রদান করে।\n• ব্যবহার প্রক্রিয়া: স্বয়ংক্রিয়ভাবে অবস্থান শনাক্ত করে -> আগামী ৫ দিনের বৃষ্টি, রোদ ও আর্দ্রতার তথ্য দেয় -> দুর্যোগের আগাম সতর্কবার্তা দেয়।\n• কৃষিতে প্রভাব: এটি 'জলবায়ু-স্মার্ট কৃষি' বা Climate-Smart Agriculture নিশ্চিত করে। বৃষ্টির আগে সার বা ওষুধ না দিয়ে কৃষক অপচয় রোধ করতে পারেন।"
                        },
                        {
                            title: "চ. ফার্ম-টু-ফর্ক ট্রেসেবিলিটি (Traceability)",
                            text: "• প্রযুক্তি: একটি ডিজিটাল লেজার যা ফসলের জীবনের প্রতিটি ধাপ রেকর্ড করে। প্রতিটি ব্যাচের জন্য এটি একটি স্বতন্ত্র কিউআর কোড তৈরি করে।\n• ব্যবহার প্রক্রিয়া: বীজ রোপণ, সার প্রয়োগ, সেচ এবং ফসল কাটার তারিখ ও ছবি আপলোড করা হয় -> সিস্টেম কিউআর কোড তৈরি করে -> ভোক্তা স্ক্যান করে পুরো ইতিহাস দেখেন।\n• কৃষিতে প্রভাব: এটি খাদ্য নিরাপত্তা ও স্বচ্ছতা নিশ্চিত করে। রপ্তানি বাজারে প্রবেশের সুযোগ তৈরি করে, যা কৃষকের আয় ২০-৩০% বাড়াতে পারে।"
                        }
                    ]
                },
                {
                    title: "৩. আধুনিক কৃষিতে প্রভাব",
                    icon: Globe,
                    text: "ক্রপ ডক্টর এআই চাষাবাদের পুরোনো ধারণা বদলে দিচ্ছে:",
                    subsections: [
                        {
                            title: "দক্ষতা ও ফলন বৃদ্ধি",
                            text: "খামারকে একটি ডাটা-চালিত ফ্যাক্টরি হিসেবে বিবেচনা করে আমরা অনুমানের নির্ভরতা কমাই। সঠিক ইনপুট বা উপাদান সঠিক সময়ে দিলে ফলন সর্বোচ্চ হয়।"
                        },
                        {
                            title: "পরিবেশ রক্ষা ও টেকসই উন্নয়ন",
                            text: "প্রয়োজন অনুযায়ী সার ও ওষুধ ব্যবহার করায় পরিবেশ দূষণ কমে। স্বাস্থ্যকর মাটি বেশি কার্বন শোষণ করে জলবায়ু পরিবর্তন রোধে সাহায্য করে।"
                        },
                        {
                            title: "আর্থ-সামাজিক উন্নয়ন",
                            text: "তথ্যই শক্তি। স্যাটেলাইট ও এআই প্রযুক্তি প্রান্তিক কৃষকের হাতে তুলে দিয়ে আমরা তাদের বড় শিল্পোন্নত খামারের সাথে প্রতিযোগিতায় সক্ষম করে তুলছি।"
                        }
                    ]
                },
                {
                    title: "৪. ডেভেলপার পরিচিতি",
                    icon: User,
                    text: "একজন নিবেদিতপ্রাণ কৃষি প্রযুক্তিবিদ দ্বারা উদ্ভাবিত।",
                    image: "/developer.jpg",
                    subsections: [
                        {
                            title: "প্রধান ডেভেলপার",
                            text: "নাম: মডেশ চাকমা\nশিক্ষা: বি.এসসি ইন এগ্রিকালচারাল ইঞ্জিনিয়ারিং, হাজী মোহাম্মদ দানেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (HSTU)\nভূমিকা: সিইও (CEO) এবং এআই আর্কিটেক্ট\nফোকাস: সিলিকন ভ্যালির প্রযুক্তি এবং গ্রামীণ বাংলাদেশের মধ্যে সেতুবন্ধন তৈরি করা। ফুল-স্ট্যাক ডেভেলপমেন্ট এবং জিওস্পেশিয়াল এনালাইসিসে দক্ষ।"
                        },
                        {
                            title: "উন্নয়ন দর্শন",
                            text: "আমাদের দর্শন হলো 'সবার জন্য প্রযুক্তি'। আমরা এমন আধুনিক ও সহজ সমাধান তৈরি করতে চাই যা সনাতন কৃষি এবং আধুনিক উদ্ভাবনের মধ্যে সেতুবন্ধন গড়বে। আমাদের লক্ষ্য, প্রতিটি কৃষক যেন প্রযুক্তির শক্তি কাজে লাগিয়ে নিজের ভাগ্য পরিবর্তন করতে পারেন।"
                        }
                    ]
                },
                {
                    title: "৫. যোগাযোগ",
                    icon: Mail,
                    text: "আমরা সরকারি কৃষি দপ্তর, এনজিও এবং কৃষি ইনপুট কোম্পানির সাথে অংশীদারিত্বে আগ্রহী।",
                    subsections: [
                        {
                            title: "ইমেইল",
                            text: "madeshchakma@gmail.com"
                        },
                        {
                            title: "লিঙ্কডইন (LinkedIn)",
                            text: "https://www.linkedin.com/in/madeshchakma"
                        },
                        {
                            title: "ঠিকানা",
                            text: "দিনাজপুর, বাংলাদেশ"
                        }
                    ]
                }
            ]
        }
    };

    const currentContent = content[language];

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight">
                        {currentContent.title}
                    </h1>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-lg">
                        {currentContent.subtitle}
                    </div>
                </div>

                <div className="grid gap-8">
                    {currentContent.sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <Card key={index} className="shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-t-4 border-t-primary">
                                <CardHeader className="bg-muted/30 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white shadow-sm rounded-xl text-primary ring-1 ring-primary/20">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                                            {section.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6 px-6 md:px-8">
                                    <p className="text-lg leading-loose text-muted-foreground whitespace-pre-line">
                                        {section.text}
                                    </p>

                                    {/* @ts-ignore */}
                                    {section.image && (
                                        <div className="my-8 flex justify-center">
                                            <div className="relative w-56 h-56 rounded-full p-2 bg-gradient-to-br from-primary/20 to-transparent">
                                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                                                    <img
                                                        /* @ts-ignore */
                                                        src={section.image}
                                                        alt="Developer"
                                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {section.subsections && (
                                        <div className="grid gap-6 mt-6">
                                            {section.subsections.map((sub, subIndex) => (
                                                <div
                                                    key={subIndex}
                                                    className="group p-5 rounded-2xl bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-primary/10 transition-colors"
                                                >
                                                    <h3 className="font-bold text-xl text-primary mb-3 flex items-center gap-2">
                                                        <Sprout className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                                        {sub.title}
                                                    </h3>
                                                    <div className="pl-2 border-l-2 border-primary/30 space-y-2">
                                                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-base">
                                                            {sub.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="text-center space-y-2 pt-12 pb-8">
                    <div className="flex justify-center gap-4 mb-4">
                        <Globe className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                        <Mail className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                        <Linkedin className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                        © 2026 Crop Doctor AI. Engineered for Impact.
                    </p>
                </div>
            </div>
        </div>
    );
}
