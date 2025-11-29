const calculateMatchScore = (userA, userB) => {
  let totalScore = 0;
  const maxScore = 100;

  // 1. Skill Compatibility (40 points max)
  const skillScore = calculateSkillCompatibility(userA, userB);
  totalScore += skillScore;

  // 2. Availability Matching (25 points max)
  const availabilityScore = calculateAvailabilityOverlap(userA, userB);
  totalScore += availabilityScore;

  // 3. Location Proximity (15 points max) - Optional
  const locationScore = calculateLocationProximity(userA, userB);
  totalScore += locationScore;

  // 4. Rating & Reputation (10 points max)
  const ratingScore = calculateRatingCompatibility(userA, userB);
  totalScore += ratingScore;

  // 5. Learning Style (10 points max)
  const learningStyleScore = calculateLearningStyleCompatibility(userA, userB);
  totalScore += learningStyleScore;

  return {
    totalScore: Math.min(totalScore, maxScore),
    breakdown: {
      skills: skillScore,
      availability: availabilityScore,
      location: locationScore,
      rating: ratingScore,
      learningStyle: learningStyleScore,
    },
  };
};

const calculateSkillCompatibility = (userA, userB) => {
  let skillScore = 0;
  const maxSkillScore = 40;

  // Check what UserA can teach that UserB wants to learn
  userA.skillsToTeach.forEach((teachSkill) => {
    userB.skillsToLearn.forEach((learnSkill) => {
      if (teachSkill.skill.toLowerCase() === learnSkill.skill.toLowerCase()) {
        let matchPoints = 20; // Base score for skill match

        // Bonus points for proficiency alignment
        if (
          teachSkill.proficiency === "expert" &&
          learnSkill.currentLevel === "beginner"
        ) {
          matchPoints += 10;
        } else if (
          teachSkill.proficiency === "intermediate" &&
          learnSkill.currentLevel === "beginner"
        ) {
          matchPoints += 5;
        }

        skillScore = Math.max(skillScore, matchPoints);
      }
    });
  });

  // Check what UserB can teach that UserA wants to learn (reciprocal learning)
  userB.skillsToTeach.forEach((teachSkill) => {
    userA.skillsToLearn.forEach((learnSkill) => {
      if (teachSkill.skill.toLowerCase() === learnSkill.skill.toLowerCase()) {
        skillScore += 15; // Bonus for reciprocal match
      }
    });
  });

  return Math.min(skillScore, maxSkillScore);
};

const calculateAvailabilityOverlap = (userA, userB) => {
  // Simple implementation - count overlapping time slots
  if (!userA.availability || !userB.availability) return 10; // Default score

  const slotsA = userA.availability.slots || [];
  const slotsB = userB.availability.slots || [];

  let overlappingSlots = 0;

  slotsA.forEach((slotA) => {
    slotsB.forEach((slotB) => {
      if (
        slotA.day === slotB.day &&
        slotA.available &&
        slotB.available &&
        timeOverlaps(slotA, slotB)
      ) {
        overlappingSlots++;
      }
    });
  });

  // Score: 1 point per overlapping slot, max 25
  return Math.min(overlappingSlots * 5, 25);
};

const calculateLocationProximity = (userA, userB) => {
  if (!userA.location || !userB.location) return 5;

  // For now, simple same-city check
  // In production, you'd use geolocation APIs
  if (userA.location.toLowerCase() === userB.location.toLowerCase()) {
    return 15;
  }

  return 5; // Default score for different locations
};

const calculateRatingCompatibility = (userA, userB) => {
  const ratingA = userA.rating || 0;
  const ratingB = userB.rating || 0;

  // Both users have decent ratings
  if (ratingA >= 4 && ratingB >= 4) return 10;
  if (ratingA >= 3 && ratingB >= 3) return 7;
  return 3; // Default score
};

const calculateLearningStyleCompatibility = (userA, userB) => {
  // Placeholder - you can expand this based on user preferences
  return 7; // Default moderate compatibility
};

const timeOverlaps = (slotA, slotB) => {
  // Simple time overlap check
  // In production, use proper time comparison
  return true; // Placeholder
};

module.exports = { calculateMatchScore };
