---
title: "Stop Telling Claude Code What To Do"
source: "https://www.youtube.com/watch?v=8_7Sq6Vu0S4"
author:
  - "[[TÂCHES TEACHES]]"
created: 2026-04-19
description: "‼️ USE MY RECOMMENDED NEW SYSTEM: https://github.com/glittercowboy/get-shit-done📝 Prompts available on GitHub: https://github.com/glittercowboy/taches-cc-pr..."
tags:
  - "clippings"
categories:
  - "[[Clippings]]"
topics:
---
![](https://www.youtube.com/watch?v=8_7Sq6Vu0S4)

## Transcript

### Intro

**0:00** · Hello and welcome back to another episode of Tash teaches. I'm Tash and in today's video I want to talk about something that has massively increased the effectiveness of my Claude code usage that we could call meta prompting.

**0:14** · A lot of people who have come to Claude code have arrived here from using more kind of ignorant, I would say childlike approaches to AI assisted coding with platforms like V0 or lovable. And the whole vibe coding concept, while lovely in theory of just saying do this, do that, make it this, works to some extent, but you'll notice that a lot of the time the things that you want don't actually get implemented properly or they break or they can't be effectively tested and you end up having to give 20, 30 individual prompts to try and solve the singular problem or add the singular feature that you wanted to in the first place.

### The 'Create Prompt' Prompt

**0:57** · So, in order to explain this, I want to bring your focus to this particular prompt that I tend to run anytime that I want to do anything of some substance.

**1:08** · If I'm just trying to change the background of something from yellow to red, sure I could do that myself, go in and adjust the CSS of whatever it is I'm building, or I could just say make the background yellow and that would work fine. But most of the time I'm doing more complex things than that, things that require multiple stages of changes across multiple files and analysis of certain things. And then ideally verification and testing to prove that what I did was right. So, I have this prompt that I call create prompt. The reason why we're talking meta prompting here is very rarely do I tell Claude what I want it to do and get it to go do it. Because most of the time there's assumptions that it will have or misalignments with my goals that mean that by me just saying what I want is not the clearest way for Claude to understand the instructions that I'm giving it.

**2:04** · So, I've folded this up here because it's a pretty long prompt that I run, but this create prompt is a prompt engineer.

**2:12** · We're going to go through this section by section and then I'm going to show you in practice how this might be useful.

**2:17** · So, what I would usually do, let me just whip this up so I could show you, is let's say I open up a new instance of Claude. Say I want to do a thing.

**2:26** · Instead of saying I want to create a dashboard or blah blah blah blah blah.

**2:31** · What I would first do is do create prompt. And then I tend to use my transcription tool. So, I would say, I want to create a dashboard utilizing blah blah blah blah blah blah blah blah blah. For some reason my transcription tool isn't working, but the point is it's going to then run this prompt. You are an expert prompt engineer for Claude code, specializing in crafting optimal prompts using XML tag structuring and best practices. Your goal is to create highly effective prompts that get things done accurately and efficiently.

**3:01** · So, the first stage is the user request.

**3:03** · The user wants you to create a prompt for arguments. And this is whatever comes after this. If I do create prompt and I say blah blah blah blah blah blah, this right here is going to be passed through as an argument to this custom slash command. So, the first thing it reads is it knows what it is, it knows what I want to do. Then we have this core process here. So, I've broken this down that first it uses thinking in these thinking tags here to analyze what my request is. So, clarity check first and foremost is it works out whether or not what I'm asking is clear enough. A lot of the time it is because usually I'll just put my transcript on and I'll say exactly what it is that I want to do. I'll really wax poetic there. But if there is not enough context, what it's going to do is let's scroll down a little bit here is it's going to ask for clarification. We'll skip back up again in a sec, but what happens in that first step is if it feels that there's not enough details, it's going to go ahead and ask me some questions.

**4:02** · So, it's going to ask specific questions about the ambiguous aspects of my prompt. Blah blah blah blah blah. As I said, most of the time I'm giving it enough detail up front that it doesn't need to do that, but if I just said build a dashboard, it's going to want more information. So, let's scroll back up here again for a sec because you can see that this whole thinking tag thing, it works out is this a single file clear goal or is it complex with multi files?

**4:25** · Also, should this be broken down into one or multiple prompts? And if they are multiple prompts, could it be parallelized? Is the tasks that I'm asking for, could they be run side by side if they're referencing different parts of the code base and actually wouldn't be editing separate things or relying on previous steps to have been completed? So, it's going to work out is it one prompt? Is it multiple? And if it's multiple, should they be done sequentially or in parallel?

**4:52** · Then it's going to figure that out, then it's going to look for how much reasoning it needs. Does it need to really think through any stages before doing that? Does it need to examine the code base structure, the dependencies or existing patterns? Should it be a concise prompt or comprehensive on the task? What file references, bash commands or MCP servers might be needed?

**5:14** · And then verification, does this task warrant built-in error checking or validation steps? Then it's going to figure that out and move on to the next stage, which as I said, interaction flow here is if it has clarification, it doesn't need that. It then goes on to confirm that it has figured out what it wants. And it's going to say this is a complex prompt, would you like me to continue? I could then give it a little bit more context if I need to. Most of the time I just say yes. And what it's going to do is it's going to then generate that prompt and save it to a folder that if doesn't already exist in the directory I'm in, it creates called prompts and then it creates the name and the number. Multiple prompts, it does the same thing, but it does 001 blah blah blah 002 yada yada yada. How does it actually create this prompt then? So, let's close this up.

**6:00** · The prompt construction rules. Um Anthropic themselves recommend when using Claude code to structure your prompts with XML tags, which are effectively anytime you've seen something like this uh where it's inside of this this little bracket, you could add in your objective. And then having this closing bracket means that Claude can then pass that logic in a way that makes much more sense to it because it's breaking up this task into sections. So, what is the objective? What is the context that's needed? What are the requirements, the constraints? And finally, what would the output be? So, it's going to figure out all of these things and it's going to also put at the bottom, very importantly, success criteria. So, if we were to have achieved the object of the objective using said context and fitting into these requirements and constraints with an output like this, how would we define the success? And also, how would we verify that we had achieved this? So, this is very important. Also, conditionally include. These are all based off of Anthropic's documentation, but we'll just skip through these.

**7:07** · Sometimes if something does need extended reasoning, it's going to add in words like thoroughly analyze or deeply consider and this is going to trigger extended thinking. Most of the time for me that triggers the sequential thinking MCP. Also, go beyond basics language.

**7:21** · When I'm saying to create like a a UI for something or a dashboard, a lot of the time Claude will do the bare minimum and it won't look great. Unless for fun for fun some funny reason, if you tell it to like impress you, go wild, you know, go beyond basics, it will actually stretch and do a little bit more.

**7:38** · Particularly with the ability of Sonnet 4.5 to do some really pretty long running tasks without any interference.

**7:46** · Also, why? Is it necessary to tell us why something must be done? Also, will it need to call tools in parallel? Uh we've got a bunch more stuff here, yada yada yada. I'm going to be uploading the this prompt um to GitHub so that you can use this yourself, but it's going to add in some of these conditional inclusions that might or might not be helpful. Also then output format, same thing down here, it's going to follow the same approach every single time adding one to the number.

**8:16** · So, great. These are the prompt construction rules. Then prompt patterns. So, I've got a few in here. If it's a coding task, here's a little example. Claude do recommend or Anthropic's documentations do recommend examples. So, if you give something an example of how you would like the output to be, it's more likely to do a good job doing it. So, here we go. Here's a coding task. It's usually going to have the objective, the context, the requirements, implementation, output, verification and success criteria. Maybe if it's an analysis task, it's going to look at these kind of things. So, the objectives, what files would need to be references? What are the requirements for said analysis? Output and again, validation to make sure that that analysis is complete. Research, same kind of thing. What is the scope of the research? What do we need as deliverables for the research?

**9:02** · Evaluation criteria on working out the quality of the research. Let's close this up.

**9:08** · Uh where are we?

**9:10** · Note, prompt patterns. There we go. Then the intelligence rules. So, here are some important things as well is that clarity first. If anything is unclear, you must ask the user before proceeding.

**9:22** · A few clarifying questions save time.

**9:24** · Would a colleague with minimal context understand this prompt? Context is critical. You always include why the task matters, who it's for and what it will be used for in generated prompts.

**9:34** · Again, this is super key for telling Claude why it's doing it, who it's for and what it will be. Therefore, it's not just giving it a task, but it's giving it context around why this task must be completed. Also, be explicit. Again, we need to be super clear about exactly what format is needed for this. What files must be created and what must they look like? Scope assessment, again, simple tasks don't need massive prompts.

**10:01** · Complex tasks are going to need really long prompts. Context loading, only request file reading as an actual tool call if the task explicitly requires understanding existing code or documentation. So again, it's going to put things in there. Precision versus brevity, default to precision. It's okay to write a long and clear prompt. It beats a short and ambiguous one. Also, tool integrations, if there are any MCP service I have and it has access to or bash commands, file references, it needs to mention which ones to use.

**10:33** · Output clarity, again, every prompt must specify exactly where to save its outputs using relative paths. Every prompt should include clear success criteria and verification steps. This is so so helpful. Sometimes, you know, we we ask it to do a thing, but there's no way that in in the way that it actually implements our decision without using meta prompting, that it thinks through, okay, after I've done this, how can I verify that it's worked? And then also, after saving the prompt, present this decision tree to the user. It says, um if you've created one prompt, I've saved it here, would you like to one, run the prompt now, two, review and edit it, three, save it for later, blah blah blah blah blah. If I choose option one, it invokes the next slash command, which is run prompt up here, which we'll have a look at in a sec. Um if it's parallel, it will say, would you like me to run them in parallel? And it's going to launch three sub agents working on this with their own context window um simultaneously. And similarly, if it's sequential, it will do them one after the other. So let's just fold this up one more time.

**11:37** · Where are we? Intelligence rules. Okay, meta instructions. Again, first check if clarification is needed before generating the prompt. Also, it then goes and reads the prompt folder to make sure that um either it exists, if it doesn't exist, and if it does, what the number should be. It keeps prompt file names descriptive but concise. Adapt the XML structure to fit the task. Not every tag is needed every time. Consider the user's working directory as the root for all relative paths. Each prompt should contain only the prompt content, no preamble or explanation. And after saving, present the appropriate decision tree, blah blah blah blah blah. Let's just close this up. We've got one final thing down here of examples when to ask for clarification. If I said build a dashboard, you should ask the user, what kind of dashboard? Admin, analytics, user-facing? What data should it display? Fix the bug, can you describe the bug? These are very simple things, but you know, you want for the prompt to push back if it doesn't feel it has the clarity.

**12:35** · Okay, so this is the essence of meta prompting. Is the goal is not to tell Claude what you want it to do, the goal is to tell Claude what you would want it to do, and therefore, how would it like best to be asked to achieve that?

**12:50** · Instead of explaining what you want and getting it to do it, you want to get it to think about how it would best do the task and create a prompt for that. Now, what I love to do is not just run this prompt directly in line in this chat window. You know, once the prompt is created, if I were to just say run prompt, and then I actually like tag the prompt, it's going to use up a hell of a lot of context in this chat window. Um and also, in the creation of that prompt, it's used up a lot of context in thinking about how to create the prompt, which means we've actually polluted the the entire chat with context that is not necessary while it's figuring out what to do. The prompt in and of itself is a self-contained solution to the problem, which is why I have this next prompt here called run prompt.

### The 'Run Prompt' Prompt

**13:40** · Let's just fold this up. Um where are we? Uh I suppose we can't easily fold this up in the same way, but the goal of this prompt is to execute one or more prompts from the folder as delegated subtasks. This is that key thing. Um these are when they spawn sub agents. So these are self-contained, fresh context sub agents. The user specifies which prompt to run by arguments, or because this is inline, it will just know what to do. But the point is here, if it's a single prompt, it runs it on in and of itself. If it's multiple prompt, blah blah blah blah blah. You can see here um a little bit more context. Not super interesting to read through, but it's basically just explaining to Claude exactly how to launch these prompts as subtasks. So, let's actually have a look to see here how we would use this in practice.

### Using Meta-Prompting in Practice

**14:28** · So I'm going to run exactly the same prompt in two different windows. Except in one of them, I'm going to create a prompt for the prompt and then run that.

**14:38** · And in another, I'm just going to get Claude to do it in one shot with no more context. So, first, I'm going to copy and paste this prompt and I'm going to run this in the this this little folder is called with meta prompting, and then I'm going to create one which is without meta prompting. So, let's just go ahead and run that. And I'm going to put this over here for clarity. And then I'm going to create another window.

**15:01** · And I'm going to go back and I'm going to go into the without meta prompting and I'm going to just give it that exact direct prompt. So we'll say, I want to create a CLI base tool. We'll go enter.

**15:12** · So let's have a little look here. You can see that it's already asked for a bit more um a little bit more context. Whereas with here, it's probably There we go. It's just going. I'll create a generative music CLI tool with trippy visuals.

**15:26** · Straight away, it's started to create it. Whereas here, it wants some context.

**15:30** · So, audio library preferences. Do you want to use a specific node.js audio library or are you open to recommendations? In this case, I'm going to say, I'm uh I'm open to the best uh library for this given the goal. In this case, I don't really know. Visual rendering, should this use terminal graphics library like blessed? Yes, use blessed and make it beautiful and rainbow-like and trippy.

**16:03** · Number three, note sequencing. You mentioned 75% chance each 16th note plays. Should the pentatonic notes be picked randomly? Uh let's do randomly.

**16:13** · Uh with a weighting towards uh roots, octaves, and first, and then fifths, and then uh thirds, etc. The goal should be that it sounds pleasing. Cool. Number four, runtime.

**16:37** · Should this run indefinitely until stopped? Yes, indefinitely until control C. And then five, are you okay with installing NPM packages for this or do you want minimal dependencies? Yes, that's fine to install. So I'm going to run with this.

**16:53** · Let's go back over here. You can see that already, Claude has created in this view a version of this. So let's just give it a go. I'm going to do NPM start and I'm going to open this up in another tab and let's just let's just see. Let's just see what happened. Obviously, it was a lot quicker without meta prompting, but let's see what the quality of the results are.

**17:15** · \[music\] Okay, so it did something.

**17:24** · \[music\] But it's a bit \[ \_\_ \] really.

**17:28** · So I'm going to close that out, stopping the music. I hate how it uses these emojis, but it did something. So I'm curious to see now the quality of the difference here. Let's just make these the same color so that we can see which one is which. I'm going to go back to the prompt here. So, should I proceed? Yes. Cool. So Claude has gone ahead and created this prompt.

**17:48** · Let's have a little look to see what it is. Let's just widen this for a second. So the Here we go. The the objective. Build a terminal-based generative music application that creates pleasing, blah blah blah blah blah. This is for personal creative exploration and ambient background music generated.

**18:04** · Nice. Here's the context. This is a new node.js CLI application. Audio requirements. Here are all of the specific things that are needed. The visual requirements. It needs to use trippy, colorful, rainbow-like aesthetics. Runtime requirements. Technical approach. So it's going to analyze the best approach for this implementation considering the audio library selection.

**18:25** · \[snorts\] Um timing architecture, harmonic weighting, sample and hold logic, what to avoid. Avoid blocking operations, uniform random note selection. Avoid updating sample and hold every note.

**18:37** · Avoid synchronous blocking, blah blah blah blah blah. It's already decided what the project should look like. Success criteria. And then verification, can you run the application and let it play for 30 seconds? These kind of things probably do require my effort. But let's go ahead. So now, all I have to do is just press one, and you're going to see that instead of now running it in this window, it's going to launch the run prompt prompt to then run said prompt.

**19:04** · You can see it's gone and found it in this directory. I can show you that this folder itself only has in it prompts. Let's have a look in there. CD prompts. And inside of that is that folder. What's also nice is once the prompt has been run, it's going to relegate that prompt to a folder called completed. So let's close this up and we're going to see what's happening.

**19:26** · This task indicates that this is now running in its own self-contained sub agent workflow. Once it starts doing stuff, we can press control O, uh wrong button, control O, and you'll be able to see exactly what's happening. So right here, it's passed through that prompt. Let's get out of here.

**19:45** · And we can see that very shortly, it's going to start writing and reading and thinking about files. So let's just let that run and we'll come back to it in a second to see what it's done. Okay, I just got back from my breakfast bagel and Claude seems to have completed the task. We can see here that it has created various files. The key implementation details, yada yada yada, and then the tools to run it. So, I'm going to go ahead and do npm install.

**20:12** · Let's just do this in a new tab. Uh npm install. Let's make this green as well. And then we want to do npm start. All right, nice that we've got a high security vulnerability there. But let's give it a go.

**20:33** · \[music\] Kind of nice. I like that. I think you'll agree that the overall adherence to my original prompt of having a bit more of like a a structured randomness \[music\] compared to this, this buggy, clicky, whatever's going on here. This is a damn a damn lot better.

**21:05** · \[music\] Nice. Okay, so just to verify one more time that how much more effective this is, I want to do a little uh adjustment to this. So, now I want to do I want to add Uh I'm going to do this with create prompt again as well. So, create prompt.

**21:25** · I want to add uh more of a rainbow fractal fractal trippy visual aspect to it as well as mm some sample and hold slightly affecting the sine waves uh feedback to create little timberal tamboral changes and also I want to be able to uh select different scales in real time by pressing the right and left arrow keys. So, I'm just going to run this in here and then I'm also going to go back over here and I'm going to say I want to add exactly the same thing, but we're going to do it straight one shot and then with a prompt in between. So, let's see how this runs and uh we'll compare the results. Okay, so it actually wants a little bit more clarification. Rainbow fractal visuals.

**22:31** · Do you want actual fractal patterns like Mandelbrot?

**22:34** · Um I'm thinking something between Mandelbrot and spirals and making it evolving uh and generative and directly related to the music. Okay, number two, sine wave feedback. Should this be actual audio feedback delay or FM synthesis style? FM synthesis style modulation. Subtle warmth. Three, scale selection.

**23:08** · Should there be a visual indicator showing which selection?

**23:12** · Um we'll say yes. It should show in the bottom right.

**23:19** · And we should do all of the modes of the major scale and also the two pentatonic scales. And then four uh as I said above. And I think what's nice about this is it really helps you refine what it is that you want when you're asked more questions about it. And of course, instead of saying continue, I could have said after this ask me some more questions as well. And that's so key to being able to just be sure that what it is that your your prompting for is um is going to be what you want. Because sometimes you actually have to ask yourself the questions. Do I want this?

**24:03** · Do I want that? How do I envision it?

**24:05** · If if you don't know, then Claude definitely isn't going to know. So, let's run the updated version here in the one shot prompt.

**24:16** · \[music\] Okay, so you can see that it's creating some really kind of \[ \_\_ \] up problems here that weren't really fixed. This does look quite nice. I like that a lot. Let's actually see if we were to run this um if we were to run this in just regular terminal to see if that makes it any better. npm start \[music\] Okay, so we're still having all sorts of problems there. I do love those colors.

**24:49** · Those are really very nice. Can I change scale?

**24:53** · We're in pentatonic minor now.

**24:56** · \[music\] Major, minor. Cool. So, it does work, but it's not quite what I want. So, let's go back to here and we should in theory have our updated prompt. So, let's run it and then let's see what we get. While that's running, let's actually have a look to see what the prompt was like that it created for this enhancement. So, the objective, enhancing the existing music CLI tool with these three main improvements.

**25:21** · Context, the existing application. This is important. It tells it about what we already have. Examine these files. It wants to be a more trippy fractal-based situation. Here's the visual enhancement requirements. So, we need it to be more fractal with generative and continuously evolving. Visual style, maintaining rainbow spectrum, but they should be trippy and mesmerizing. Consider Unicode box drawing. Performance, blah blah blah blah blah. Audio enhancement requirements. So, now we need to add in a little bit more complexity, which is that feedback, which to be honest I don't think we even really had in this view.

**25:57** · Um \[music\] Maybe a little bit, but very subtle. Um and then let's have a look a little look here. Interactive scale selection. Uh keyboard. You can see like how in-depth this is. And all I had to do was just answer a couple of questions. So, technical approach. Research fractal generation suitable for terminal rendering. This is baked into the prompt before it does anything else.

**26:24** · Scale system, FM system, very nice. What to avoid and why. Avoid complex fractal algorithms in the audio thread. Avoid harsh FM tambours. Um yep, great. Avoid pixel-perfect fractal rendering. Modify existing files. These ones in here are the success criteria as well as then verification.

**26:43** · Very nice. So, this looks as though it's about to finish. Um I'd be curious to know exactly how long it took to do, uh but we'll come back to this in one moment. Okay, took about 8 minutes to complete that prompt, but we are now uh done. Just before we dial that in, let's give it one more occasion of the cheap buggy, crappy one, the one shot prompt, versus what it would be if we did those two prompts. So, here we go. I'm very excited.

**27:17** · \[music\] Let's change key. A bit weird what's happening up here with the text.

**27:29** · \[music\] And now we're in pentatonic minor.

**27:37** · Let's do Phrygian.

**27:39** · \[music\] \[music\] Ooh, Lydian.

**27:51** · We've got a bunch of nice scales in here. Anyway, you get the idea. I think what's just really great about this approach is not just does it help you understand what you want before you ask for it, but it just makes the entire process of actually prompting so much easier. Because you don't have to think about the things that the LLM will need as a human being like, okay, what does Claude need? Instead, you ask Claude, what do you need? Out of interest, let's just check out the code base here. I've got the without meta prompting and the with meta prompting here. Let's have a look to see how it was even constructed. So, when I just asked for it without creating prompts beforehand, it created just this I was going to say a monolith, but it's not even really a very big file. It's a 286 line single index.js and then it's got some node modules here.

**28:42** · Um that's it. Let's see how it organized things in the prompt-based one. So, you can see here that we've got that index.js entry point. It's only 63 lines long and it references the source files here where we've got an independent script for audio. We've also then got an independent script for visuals here. Um very nice. We've even got a little read me here that explains exactly how to use it, all that sorts of information.

### Outro

**29:10** · So, I know that this seems um potentially a little bit long-winded.

**29:15** · You know, and as I said at the beginning of this video, if you just want to change the background color of something to red to yellow, or you want to change a font, there's no point you wasting the time uh getting Claude to think about how it should ask itself to do that thing. But when you want to compound the upgrades of what you want to make to your system, to your code base, I highly recommend running this prompt beforehand because the quality, as you can see, is just so much better. I know that we looked at it today in the context of creating a CLI-based tool, But, this works for refactoring, this works for database migrations, this works for whatever it is that you want to do that requires a little bit more thought than just do X thing. Um so, highly recommend it. I'm going to put the link to be able to download this prompt in the description down below. Give it a go and let me know what you think. And also, let me know if you're interested in any more videos about some of the prompts that I use.

**30:10** · I've got a couple of really exciting ones that I think we could look at next. But, in the meantime, uh that's all That's all, folks. Uh thank you for watching.