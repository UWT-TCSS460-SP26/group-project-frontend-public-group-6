# Group 6 2026-05-24 Sprint 6 Meeting 1 (4:30 - 5:50)

**Modality: Discord**

**In attendance: Luke, Jayda, Connor, John**
**Notes taker: John**
**Meeting Manager: Luke**
- Fixed .env file

- Tried fixing Auth and "invalid credentials" for the sprint
  
- Discussed the tasks needed to be done
  
# Group 6 2026-05-24 Sprint 7 Meeting 1 (8:30 - 9:50)

**Modality: Discord**

**In attendance: Luke, Jayda, Connor, John**
**Notes taker: John**
**Meeting Manager: Connor**

- Frontend design refinements

- Took Connor's work from reviews since Jada's version had bugs 

- Discussed the remaining tasks to be done

# Group 6 2026-05-24 Sprint 7 Meeting 1 (4:30 - 6:50)

**Modality: Discord**

**In attendance: Luke, Jayda, Connor, John**
**Notes taker: John**
**Meeting Manager: Jayda**

- Finalizing frontend design
- Fixing remaining bugs
- Discussed the design for final


#Retrospective

**What went well across the ten weeks**

Even with some early stumbles getting everyone oriented to the stack, our team consistently shipped something every sprint. There was always someone ready to pick up slack when life got in the way for someone else, and by the end of each week we had a solid picture of who did what and why. We ended up with pseudo-leads for frontend and backend pretty organically, and that structure helped a lot, as it gave us a natural person to go to for questions without needing to formalize anything. Our design turned out genuinely solid, both visually and architecturally, and the backend was put together cleanly enough that we could respond to bug reports quickly without having to revisit decisions we'd already made.
Communication wasn't always perfect, but when something broke or blocked us, we got on a call and worked through it. That reliability mattered more than having flawless coordination from day one. We also got better at collaborating as the quarter went on. The team was flexible around each other's schedules, and everyone showed up to meetings with genuine engagement. That enthusiasm made a difference, especially during the harder stretches.

**What we'd do differently if we were starting the quarter again**

The biggest thing is sprint planning. Meetings drifted in frequency and length as the quarter went on, and while we always landed on our feet, the cost was a lot of late-week scrambling that could have been avoided. We didn't need daily standups, we just needed everyone to have read the sprint and communicated their piece earlier in the week rather than right before deadlines. A short async check-in mid-week would have gone a long way, and we did try to do this some weeks, but others it fell through. The meetings we did have had a tendency to run long and wander, when most of the time a tight 20-minute sync would have been more useful.
On the implementation side, it would have helped to sketch out a full feature roadmap at the start and identify which ones carried the most risk. That's a big ask in week one when you're still learning the stack, but knowing earlier where the hard problems were hiding would have let us front-load the difficult work instead of running into surprises in later sprints. A little more upfront planning would have made the back half of the quarter feel a lot less reactive.

**What surprised you about working on someone else's API and having someone else work on yours**

The biggest surprise was how different the other team's implementation was despite us working from the same user stories and sprint requirements. Route naming, response shapes, error handling — none of it mapped directly to what we'd built, and that mattered the moment we tried to integrate. We submitted bug reports for things we'd considered fairly straightforward, because our assumptions about how those features worked didn't transfer. That said, response time from the other team was consistently quick, which made the whole process smoother than it could have been.
The flip side was equally instructive. Watching another team use our API revealed gaps in our documentation and design decisions that we couldn't see from the inside, like things that felt obvious to us were not obvious to someone coming in fresh. It's easy to design for the mental model you already have. Having a real external consumer forced us to think about our API the way a frontend or third-party client would, which is honestly the context that matters most in actual professional work. Whether you're backend, frontend, or full stack, understanding how your code gets used by someone who wasn't in the room when you built it is a genuinely valuable thing to have experienced firsthand.

**What you learned about working with AI coding agents that you didn't know in Week 1**

AI coding agents are honestly more powerful than most of us expected going in, and not just for the obvious reasons. The real unlock isn't autocomplete or boilerplate, it's having an assistant that understands your project's structure, intent, and context well enough to help you think through architectural decisions. The amount of things we "just had AI do" this quarter increased significantly as we got more comfortable with that, and the results were often better than what we'd have written manually under time pressure. The webhook into Supabase for Discord notifications is a perfect example. It's clean, effective code that would have taken much longer to write from scratch.
What we learned, though (especially after Sprint 5) is that context engineering beats prompt engineering. A vague ask gets a vague answer; a well-framed question with real project context gets something genuinely useful. That discipline carries over into how you evaluate and integrate AI suggestions too, because not everything it produces will fit what the professor or the spec actually expects, and you still have to understand the code well enough to know when something is off. We're walking away from this quarter with better instincts for how to use AI as a real productivity multiplier, and that feels like a skill that'll matter well beyond this class.
