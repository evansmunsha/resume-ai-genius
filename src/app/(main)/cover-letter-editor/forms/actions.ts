"use server";

import openai from "@/lib/openai";
import { canUseAITools } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { generateOpeningSchema, GenerateOpeningInput } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { generateExperienceSchema, GenerateExperienceInput } from "@/lib/validation";
import { generateCompanyKnowledgeSchema, GenerateCompanyKnowledgeInput } from "@/lib/validation";
import { generateFuturePlansSchema, GenerateFuturePlansInput } from "@/lib/validation";
import { generateClosingSchema, GenerateClosingInput } from "@/lib/validation";
import { generateAchievementSchema, GenerateAchievementInput } from "@/lib/validation";

export async function generateOpening(input: GenerateOpeningInput) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);

    if (!canUseAITools(subscriptionLevel)) {
        throw new Error("Upgrade your subscription to use this feature");
    }

    // Validate input against the schema
    const { jobTitle, skills, achievements, experience, companyKnowledge, futurePlans, closing } = generateOpeningSchema.parse(input);

    const systemMessage = `
        You are a cover letter generator AI. Your task is to write an engaging opening statement for a cover letter based on the user's provided data.
        Only return the opening statement and do not include any other information in the response. Keep it concise and professional.
    `;

    const userMessage = `
        Please generate an engaging opening statement for a cover letter for the following position:

        Job Title: ${jobTitle || "N/A"}

        Skills: ${skills?.join(", ") || "N/A"}

        Achievements: ${achievements.map(a => 
          `${a.description} (Impact: ${a.impact}, Date: ${a.date})`
        ).join(", ") || "N/A"}

        Experience: ${experience || "N/A"}

        Company Knowledge: ${companyKnowledge || "N/A"}

        Future Plans: ${futurePlans || "N/A"}

        Closing: ${closing || "N/A"}
    `;

    console.log("systemMessage", systemMessage);
    console.log("userMessage", userMessage);

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: systemMessage,
            },
            {
                role: "user",
                content: userMessage,
            },
        ],
    });

    const aiResponse = completion.choices[0].message.content;

    if (!aiResponse) {
        throw new Error("Failed to generate AI response");
    }

    return aiResponse;
}

export async function generateExperience(input: GenerateExperienceInput) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);
    if (!canUseAITools(subscriptionLevel)) {
        throw new Error("Upgrade your subscription to use this feature");
    }

    const { experience } = generateExperienceSchema.parse(input);

    const systemMessage = `
        You are a professional cover letter writer. Your task is to enhance and expand upon the provided experience description.
        Make it more compelling and professional while maintaining the core information.
        Focus on achievements, skills demonstrated, and quantifiable results.
    `;

    const userMessage = `
        Please enhance and expand upon the following experience description for a cover letter:

        Original Experience:
        ${experience || "No experience provided"}

        Please make it more detailed, professional, and impactful while maintaining authenticity.
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
        ],
    });

    return completion.choices[0].message.content || "";
}

export async function generateCompanyKnowledge(input: GenerateCompanyKnowledgeInput) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);
    if (!canUseAITools(subscriptionLevel)) {
        throw new Error("Upgrade your subscription to use this feature");
    }

    const { companyKnowledge } = generateCompanyKnowledgeSchema.parse(input);

    const systemMessage = `
        You are a professional cover letter writer. Your task is to enhance and expand upon the provided company knowledge section.
        Make it more compelling and show deep understanding of the company while maintaining authenticity.
        Focus on company values, mission, recent achievements, and alignment with the candidate's goals.
    `;

    const userMessage = `
        Please enhance and expand upon the following company knowledge section for a cover letter:

        Original Company Knowledge:
        ${companyKnowledge || "No company knowledge provided"}

        Please make it more detailed, professional, and show genuine interest in the company.
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
        ],
    });

    return completion.choices[0].message.content || "";
}

export async function generateFuturePlans(input: GenerateFuturePlansInput) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);
    if (!canUseAITools(subscriptionLevel)) {
        throw new Error("Upgrade your subscription to use this feature");
    }

    const { futurePlans } = generateFuturePlansSchema.parse(input);

    const systemMessage = `
        You are a professional cover letter writer. Your task is to enhance and expand upon the provided future plans section.
        Make it compelling and show clear career goals while maintaining authenticity.
        Focus on growth potential, alignment with the role, and long-term commitment.
    `;

    const userMessage = `
        Please enhance and expand upon the following future plans section for a cover letter:

        Original Future Plans:
        ${futurePlans || "No future plans provided"}

        Please make it more detailed, professional, and show genuine enthusiasm for future growth.
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
        ],
    });

    return completion.choices[0].message.content || "";
}

export async function generateClosing(input: GenerateClosingInput) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);
    if (!canUseAITools(subscriptionLevel)) {
        throw new Error("Upgrade your subscription to use this feature");
    }

    const { closing } = generateClosingSchema.parse(input);

    const systemMessage = `
        You are a professional cover letter writer. Your task is to enhance and expand upon the provided closing statement.
        Make it polite, professional, and confident while maintaining authenticity.
        Focus on expressing gratitude, reiterating interest, and providing clear next steps.
    `;

    const userMessage = `
        Please enhance and expand upon the following closing statement for a cover letter:

        Original Closing:
        ${closing || "No closing provided"}

        Please make it professional, gracious, and end on a strong note.
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
        ],
    });

    return completion.choices[0].message.content || "";
}

export async function generateAchievement(input: GenerateAchievementInput) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);
    if (!canUseAITools(subscriptionLevel)) {
        throw new Error("Upgrade your subscription to use this feature");
    }

    const { description, impact, date } = generateAchievementSchema.parse(input);

    const systemMessage = `
        You are a professional cover letter writer. Your task is to enhance the provided achievement.
        Return TWO sections:
        1. Description: A detailed description of what was accomplished
        2. Impact: The measurable results and business value
        Make both sections impactful with specific metrics and outcomes.
    `;

    const userMessage = `
        Please enhance this achievement with two distinct sections:

        Current Description: ${description || "No description provided"}
        Current Impact: ${impact || "No impact provided"}
        Date: ${date || "No date provided"}

        Return the response in this format:
        Description: [enhanced description]
        Impact: [enhanced impact]
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
        ],
    });

    const enhancedAchievement = completion.choices[0].message.content;
    if (!enhancedAchievement) {
        throw new Error("Failed to generate achievement");
    }

    // Parse the response into description and impact
    const descriptionMatch = enhancedAchievement.match(/Description:([\s\S]*?)(?=Impact:|$)/);
    const impactMatch = enhancedAchievement.match(/Impact:([\s\S]*?)$/);

    return {
        description: descriptionMatch?.[1]?.trim() || description || "",
        impact: impactMatch?.[1]?.trim() || impact || "",
        date: date || new Date().toISOString().split('T')[0]
    };
}
