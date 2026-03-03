# Fori V0 — Product Spec

**Tagline:** Tell me what you want to learn. Here's your path.

**One line:** Fori takes your learning goal and generates a beautiful visual path of real resources — YouTube videos, articles, podcasts, courses — in the order that actually makes sense.

---

## What V0 Is

A web and mobile app where you:
1. Type a learning goal
2. Answer 3 quick questions
3. Watch a visual learning path build itself on screen

That's it. No accounts, no library, no social layer yet. Just the generation moment done beautifully.

---

## User Flow

### Step 1 — Landing
Clean, minimal page. Center of screen:

```
What do you want to learn?
[ I want to learn Korean in 6 weeks        ]
                              [ Build my path → ]
```

Subtext: "Fori builds you a personalized path from real resources across YouTube, podcasts, articles and more."

---

### Step 2 — 3 Quick Questions
After submitting the goal, three questions appear one at a time (not a form — conversational, one at a time with a smooth transition):

**Q1:** "What do you already know about this?"
- Nothing / complete beginner
- A little (some basics)
- Some foundation (intermediate)
- Quite a bit (just filling gaps)

**Q2:** "What hasn't worked for you before?"
- Textbooks / reading-heavy content
- Video courses (too slow/passive)
- Apps like Duolingo (too gamified)
- Nothing — I haven't tried yet

**Q3:** "How much time per day can you commit?"
- 15 minutes
- 30 minutes
- 1 hour
- 2+ hours

---

### Step 3 — Generation (The Magic Moment)
Full screen canvas appears. A subtle animated background. Then blocks start appearing one by one as Claude streams the response.

**Generation animation:**
- Canvas fades in empty
- Phase label appears first: "FOUNDATION"
- First block drops in with a soft spring animation
- Connection line draws itself to next block
- Next block appears
- Continues until path is complete (~5 blocks)
- Subtle completion pulse when done

Each block contains:
- Resource type icon (📺 YouTube / 🎙️ Podcast / 📝 Article / 🎓 Course / 🎮 Quiz)
- Resource title
- Platform name
- Estimated time ("~20 min" / "4 weeks")
- One-line annotation in italics — Claude's honest note about why this resource and when

---

### Step 4 — Viewing the Path
After generation the user can:
- Scroll/pan the canvas
- Tap any block to expand it (shows full annotation + link if applicable)
- See phase groupings clearly (Foundation → Intermediate → Practice)
- See branching paths where relevant ("go deep on grammar" vs "survival phrases only")

**No editing in V0.** Just view. Keeps scope tight.

---

## Visual Design

**Aesthetic:** Clean, warm, thoughtful. Not corporate. Feels like a well-designed notebook.

**Color palette:**
- Background: Off-white (#F8F6F1) — warm not clinical
- Blocks: White cards with subtle shadow
- Connection lines: Warm gray (#C4B9A8)
- Phase labels: Small caps, muted
- Accent: One warm color for CTAs — terracotta or sage

**Typography:**
- Goal text: Serif (Lora or Playfair) — feels considered
- Block titles: Clean sans-serif (Inter)
- Annotations: Italic, slightly muted

**Block design:**
```
┌─────────────────────────────────┐
│ 📺  Learn Hangul in 1 Hour      │
│     YouTube · 90 min            │
│                                  │
│  "Watch this before anything    │
│   else — builds the visual      │
│   foundation everything needs"  │
└─────────────────────────────────┘
```

**Mobile:** Same flow, canvas scrolls vertically on mobile (linear layout), horizontally on desktop (branching layout).

---

## Claude API Prompt Structure

Claude receives:
```
Goal: "I want to learn Korean in 6 weeks"
Current level: Complete beginner
What hasn't worked: Apps like Duolingo
Time per day: 30 minutes
```

Claude returns structured JSON:
```json
{
  "phases": [
    {
      "name": "Foundation",
      "duration": "Week 1-2",
      "nodes": [
        {
          "id": "1",
          "type": "youtube",
          "title": "Learn Hangul in 1 Hour",
          "platform": "YouTube",
          "channel": "Learn Korean with Go! Billy Korean",
          "estimated_time": "90 min",
          "annotation": "Watch this before anything else — builds the visual foundation everything needs",
          "connects_to": ["2"]
        }
      ]
    }
  ],
  "branches": [
    {
      "label": "Want deeper grammar?",
      "from_node": "4",
      "nodes": [...]
    }
  ]
}
```

System prompt instructs Claude to:
- Only recommend real, specific resources (named YouTube channels, specific podcasts, real courses)
- Write annotations as a knowledgeable friend, not a textbook
- Be honest ("skip the first 2 chapters if you know X")
- Include 5 nodes total for V0 simplicity
- Add 1-2 branches where natural
- Vary resource types (not all YouTube)

---

## Tech Stack

**Web:** React + Vite
**Mobile:** React Native (Expo) — shares most logic with web
**Canvas rendering:** React Flow (handles nodes, edges, pan/zoom)
**Styling:** Tailwind CSS
**API:** Claude claude-sonnet-4-20250514 via Anthropic API
**Streaming:** Server-sent events so blocks appear as Claude generates them
**Backend:** Minimal FastAPI — just proxies Claude API call (keeps API key server-side)
**Storage:** None in V0 — paths are not saved (V1 feature)

---

## V0 Definition of Done

- [ ] Landing page with goal input renders on web and mobile
- [ ] 3-question flow works smoothly with transitions
- [ ] Claude generates a valid structured path from any learning goal
- [ ] Canvas renders nodes and connections correctly
- [ ] Generation animation plays — blocks appear one by one
- [ ] Each block shows type, title, platform, time, annotation
- [ ] Phase groupings visible
- [ ] At least one branch renders correctly
- [ ] Looks beautiful on desktop and mobile
- [ ] Works end to end for 3 different test goals

---

## What V0 Is NOT

- No user accounts or saved paths
- No sharing or public library
- No editing of generated paths
- No voice input
- No sticky notes or Wavenotes integration
- No forking other people's paths
- No quiz blocks (V1)
- No resource thumbnails (V1)

---

## The Demo Video

10 seconds that goes on X:

1. Type "I want to learn Korean in 6 weeks"
2. Answer 3 quick questions
3. Watch the canvas build itself — blocks dropping in, lines drawing
4. Final path visible, beautiful, complete

**Caption:** "Built an app that generates personalized learning paths from real resources. Tell it your goal, what you know, and what hasn't worked. It builds you a map. This is mine for learning Korean 🗺️"

---

## V1 Preview (Don't Build Yet)

- Save paths (requires auth)
- Share via link
- Public paths library — browse other people's paths
- Fork a path and make it yours
- Resource thumbnails
- Quiz/checkpoint blocks
- Wavenotes integration — captures feed into paths

---

## Build Order

1. Claude prompt + JSON schema — get the generation working in isolation first
2. Landing page + question flow
3. Canvas rendering with static test data
4. Wire Claude output to canvas
5. Streaming animation
6. Mobile layout
7. Polish — typography, colors, animations
8. Test with 10 different learning goals

**Estimated time to V0: 5-7 days of focused building**

---

*Fori — every expert left a trail. Now you can follow it.*