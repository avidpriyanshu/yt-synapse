---
title: "Linux on MacBook experience"
source: "https://www.youtube.com/watch?v=GiXHkRc8axM"
author:
  - "[[Bog]]"
created: 2026-04-24
description: "Click this link https://boot.dev/?promo=BOG and use my code BOG to get 25% off your first payment for boot.dev.🟪 Wallpapers:https://store.thaomaoh.com/b/solacehttps://store.thaomaoh.com/b/reverie"
tags:
  - "clippings"
categories:
  - "[[Clippings]]"
topics:
scrapping: "yes"
---
![](https://www.youtube.com/watch?v=GiXHkRc8axM)

Click this link https://boot.dev/?promo=BOG and use my code BOG to get 25% off your first payment for boot.dev.  
  
🟪 Wallpapers:  
https://store.thaomaoh.com/b/solace  
https://store.thaomaoh.com/b/reverie  
  
🧪 Learn to make money on YouTube:  
https://thaomaoh.com/community  
  
https://store.thaomaoh.com/  
  
MY FAVORITE THINGS:  
🖱️ - My Mouse - https://amzn.to/4fZZQCT  
⌨️ - My Keyboard - https://amzn.to/41qe9gc  
🖥️ - My Insane Monitor - https://amzn.to/4h3dPJk  
🎙️ - My Microphone - https://amzn.to/3VW1UnU  
🔒 - VPN I'm using - https://go.getproton.me/SH1W4  
  
Some of the links above are affiliate links that I get a kickback from.

## Transcript

**0:00** · I have this old MacBook and recently it's gotten really slow, but it's a great laptop and I thought what if I could revive it by switching out Mac OS to Linux. Linux is known to be less bloated and faster, especially on older laptops. Now, I've installed Linux many times before alongside my Windows PC and had a bunch of problems, especially with my monitor. This MacBook has two monitors, the regular one and the touchpad. Also, I've never installed any other operating system alongside Mac OS.

**0:31** · And the first time I installed Linux on Windows, I accidentally nuked my entire hard drive with all my stuff inside of it. So, first, let's figure out how to do this the safest way possible.

**0:41** · Installing Linux on a MacBook depends on the processor. Use Asah Linux, Fedora for Apple Silicon. I don't have Apple Silicon, it's Intel. It involves downloading a Linux ISO, Ubuntu Mint, flashing it onto a USB drive. So, wait, I can install any Linux distro onto it.

**0:59** · Oo, can I install Omari? Yes, you can install Arch Linux on an Intelbased Mac.

**1:05** · Maybe I don't even want that. For most Intel-based MacBooks, Linux Mint and Ubuntu versions are the top choices due to their userfriendliness. Wait, I've never tried Ubuntu ever. Okay, let's do it. Let's do it. How to install Ubuntu LTS on Mac OS. Installing it involves downloading the Ubuntu ISO, creating a bootable USB drive using Bolena etcher, and booting the Mac while holding the option key. Oh, so it's pretty straightforward then. Ubuntu ISO for Intel Mac. What does LTS mean? Long-term support, ladies and gentlemen.

**1:36** · Extended up to 15 years with Ubuntu Pro. Oh, I didn't know Ubuntu was like a paid thing. Intel or AMD architecture?

**1:46** · Download. It's 5 GB. Well, I've installed Linux quite a few times in the past, so I know how the installation process should go on Windows. You need a USB drive. Then you like put this file onto that USB drive with some tool. Then plug it into your computer and kablammo.

**2:03** · Okay, the file has downloaded. Let's put this onto a USB stick. For that, I'm going to need an app called Rufus. Here, I make sure I select my USB and then my dis image here. Disc image is this file.

**2:14** · And once it finishes, I'll then be able to plug in my USB drive into the MacBook and hopefully somehow install Ubuntu.

**2:22** · While it's still transferring, I want to tell you about a better way to learn new skills than what I'm doing here by just randomly poking around and specifically programming skills on boot.dev who reached out to me and asked if they could sponsor this video. Their entire mission is to teach you back-end web development from complete scratch in the Python, SQL, and Go programming languages. And you learn to code by doing what you'll actually do at a job, building real projects. I've been taking their Python course for 10 minutes a day, and I'm glued to the screen.

**2:53** · Makes me excited and look forward to learn.

**2:58** · What I like most is that their entire platform is designed to destroy boredom.

**3:03** · It's like a programming RPG. You earn XP, levels, achievements, and fight bosses to get to the top spot in the global leaderboard. There's also training grounds, a feature where you can grind infinite challenges to give you as much practice as you need before you move ahead in your coursework. Also, all content on boot.dev is completely free to read and watch. A paid membership unlocks interactive features like hands-on coding, AI assistance, progress tracking, and game mechanics.

**3:32** · So you can learn useful skills that will set you up to potentially earn a lot of money and do it in a fun way that feels like playing a game. So go to bu.dev and use my code bog to get 25% off your entire first year on the annual plan.

**3:47** · I'm super happy that they agreed to sponsor this video. Their platform is amazing. Okay, let's get back to Linux.

**3:52** · Oh, I have to partition my hard drive if I'm dual booting, which means if I want to also have Mac OS available, then I split my hard drive in two pieces essentially. You know what? I think let's keep Mac OS. So, I'm on the Mac.

**4:06** · Let's go into disk utility. Boom. Then here I can choose partition. Click add plus to increase the number of partitions on the devices. Okay. Boom.

**4:15** · Do you want to add a volume to the APFS container? Add partition. Okay. Now, it's split it into two halves. This is Mac OS and this is going to be Linux.

**4:24** · So, let's name this Linux. Very cool.

**4:27** · Format. Wait, which one did I need? Set the format to MS DOS fat. Let's set it to fat. Oh, wait. Why not XFAT? Isn't that also good for Linux? Why MS DOS? MS DOS versus FAT. For sharing files between Linux and Mac OS, XFAT is the superior choice. Well, well, well. So, we'll just go apply. Okay, it's done. I see Macintosh HD and Linux. Very good.

**4:52** · So, if I open Finder now, I should see less. Yes, there's less space now on my Mac. Then I'm going to plug in the USB that I put Linux on into the Mac. Then restart the Mac. And while it's restarting, I want to hold the option key.

**5:08** · So, I just tried to boot into the USB on my Mac. And at first, it showed these two options. This was my Mac and this is the EFI boot which I thought was the USB. So I clicked on it and no matter what I did, I kept getting this error.

**5:22** · Unable to verify startup disc. Please try again. I went into some recovery options. Tried to do like some weird stuff, but this just kept showing up. So what I think happened is that this isn't even my USB here. I think this is the second volume that I created before.

**5:40** · Probably my USB doesn't even show up.

**5:42** · Maybe. Or maybe this is the USB. If a USB drive does not show up in the Intel Mac boot menu, it's likely due to incorrectly created bootable USB security settings on T2 equipped Macs or USB incompatibility. Wait, there's a video. Dual boot Mac OS and Ubuntu.

**5:58** · Okay, let's go. Okay, so he's using Bolena Etcher. I used the Rufus tool.

**6:02** · Maybe they're somehow different. I don't know. Oh, this is the USB. He said the USB will be orange and for me it's also orange. So, what did I do wrong? Okay, I'm going to try to use the Bolena etcher instead and maybe that somehow magically solves it. I don't think that using a different tool for this will fix it, but maybe it will. Oh, wait. The ISO I used is the AMD ISO. That's why it probably doesn't work. It must have automatically downloaded the AMD version because that's the processor and the graphics card that my PC has. Abuntu LTS download. Oh, no.

**6:35** · It says Intel or AMD architecture. So, this should have been good. Does it say AMD now as well? Yeah, it does. That doesn't even make any sense. Okay, so let's redo this flash drive. Once it finishes, I'll do the same exact thing. Here we go. This is the moment of truth. Please work any second now. Unable to verify. To fix unable to verify from a USB flash drive, start by enabling allow booting from external media in the startup utility.

**7:04** · I've already done this, right? If that fails, try using a different USB port/hub.

**7:10** · Reset NV RAM. What? Okay, let's just double check that that option is enabled. Okay, you can see that it's enabled. Allow booting from external or removable media. But I also just enabled this. Before it was set to full security and now it's no security, which does not enforce any requirements on bootable OSS. Let's try. Maybe this works, please. Oh I forgot to hold option. Okay, here we go. Oh, it is working. Try or install Ubuntu. Yes, please. So, I just had to disable secure boot. Good to know.

**7:41** · And there's the Ubuntu logo. That's not focusing. Hello.

**7:46** · This should be a simple installation from now on, right? Also, look at the light it gives off there. That's pretty cool. Now, I guarantee nothing on the touchpad will work. That's like for sure. I hope like the keyboard buttons get recognized. Ooh, it just went into this screen. Oh, the trackpad doesn't work. Let's try to plug in my mouse maybe. No mouse as well. Never mind. It was plugged into my main computer. There we go. But why does the trackpad not work? Is that like something you fix later? Does the keyboard work? What if the keyboard doesn't work? Connect to the internet. No Wi-Fi devices detected.

**8:20** · No wired connection detected. This might have a lot more problems than I expected. Network opened up. VPN proxy.

**8:28** · Keyboard, mouse, and touchpad. Touchpad still doesn't work. Mouse acceleration.

**8:32** · And where do I find the internet settings? Surely under network, there's only VPN and proxy, I guess. Let's continue. Install recommended proprietary software for graphics and Wi-Fi. Okay, let's go. So, now we just need to make sure we select the correct partition. Oh, it's XFAT. That's the one that I made. So, this has to be it. If I select this, the button is grayed out.

**8:53** · If I select this, it's still grayed out.

**8:56** · Do I click change? Uh, what do I pick from this list? XD4. Now it selects it, but I can't click next. Wait, I do XT4, I think, and then I make this slash, which means the root folder, I think.

**9:09** · Yes. Oh, I can now click next. Create your account.

**9:13** · Oh, the keyboard also doesn't work.

**9:15** · Maybe I can continue without the keyboard somehow. Let's go to settings.

**9:19** · Nope. Bluetooth found. What if I instead of connecting a mouse, I just connect my keyboard.

**9:25** · Got him. Okay, beautiful. We finessed our way through the installation. You know, for the location, let's go to Dagistan. Two, three years and forget.

**9:34** · Where is it? Like somewhere here. Boom.

**9:35** · Ubuntu LTS is installed and ready to use. Let's restart. Oh, so there's EFI boot now and Macintosh HD. So, I guess let's go EFI boot. And that is Ubuntu.

**9:48** · Okay. Does the trackpad work? No. Does the keyboard work? No. We're going to find a way to fix that for now. At least I have two ports available. upgrade this machine to Ubuntu Pro three free for up to five machines. So now top one priority before I start exploring what's there is to get my computer input systems working. Ubuntu Mac keyboard and trackpad not working fix. This typically happens from a missing or faulty Apple spy.

**10:18** · I am the spy. Connect an external USB keyboard and mouse to regain control and perform troubleshooting or install the Apple SPI driver manually. So, I just have to paste this into the terminal.

**10:30** · Right. Clones this GitHub page. Let's see what that is. It's an input driver for the touchpad and keyboard found in the 12in MacBook. A touch bar driver is also available. Wait, we might get that to work as well. So, I need to open up the terminal. And so let's do pseudoapp install dkms. Boom. Okay, it's installing. Failed to fetch a bunch of stuff. I don't think this should give me that many errors. Oh, maybe because I'm not connected to Wi-Fi.

**10:57** · Wait, inside of network, it only shows a VPN and like nothing else. No Wi-Fi adapter found. So, how am I going to connect to the Wi-Fi if there's no Wi-Fi adapter?

**11:12** · Something's wrong here.

**11:15** · Let's get back to research. Ubuntu no Wi-Fi fix MacBook. Please reboot with the Ubuntu USB stick while booted into Ubuntu. Open terminal and run this. I already reformatted my USB back to like normal. Of course, of course I did. Most common solution is opening software and updates, going to the additional drivers tab, and selecting Broadcom driver. Okay, I'll I'll check if that's there.

**11:39** · Yep, it's there's nothing inside additional drivers. Do I have to reinstall the entire thing again? Please don't tell me. Connect it to the internet with your phone. Seems like you already did it in the picture. Wait, how do you do that? Bluetooth iPhone VPN.

**11:54** · Wait, proxy? Maybe it's proxy. Can I connect it with my phone? And then once I do that, open the additional drivers app and install the required Wi-Fi driver. Hold on a second. To connect an Android phone, we might be in trouble.

**12:05** · Use the USB tethering for internet. What if I'm not using an Android phone? Why does it not come with the driver in the first place? This is like so unnecessary. Okay, there's a setting called maximize compatibility inside my iPhone and it says to connect using USB, plug your phone into your computer.

**12:24** · Choose iPhone from the list of network services in your settings. Let's try this. Okay, there's a new iPhone thing that appeared. What if I go to settings?

**12:32** · Ooh, wired now appeared. Cable unplugged. I'm not sure what this means and I cannot turn it on. What if I go to Wikipedia? Looks like there's a problem. Okay. No. Connect Ubuntu to internet via iPhone. You could do that with I fuse in a few step. First, connect your iPhone to your computer via USB and ensure that personal hotspot is enabled. Then open a terminal and enter device ID-l then restart network manager. Oh my god.

**13:01** · Or wait, I have an idea. What if I just download the driver here on my main computer and then transfer it with the USB onto Ubuntu without having to like connect my phone? Ubuntu MacBook Wi-Fi drivers solution this article. Okay, so it's called Broadcom STA common and Broadcom STA DKMS. Broadcom STA DKMS download for Linux Debian. Okay, wait, which Ubuntu am I using? Okay, my Ubuntu is 24.04.04 04 LTS. Boom. It's right here.

**13:32** · But it's Noble Numbbat or Jammy Jellyfish. What?

**13:39** · I guess let's just do jellyfish because it sounds cooler. Ubuntu Multiverse AMD. Oh, there are like a bunch of them. I have no clue what I'm doing. Or maybe it will be a lot easier to just connect the computer to the internet with my phone. Okay, I just connected my phone. It says wired in my settings. Wait, does that mean it works? Wikipedia. It now works.

**14:01** · Why does it now work? I just did the same thing. I didn't even do anything. Okay, I go to show apps then terminal. Oh, I don't have a cable for the keyboard because my phone is connected with the cable. So, if I do pseudoapp update, it should update the entire computer. Okay, beautiful. It's updating stuff. Does it maybe automatically download the drivers? So, then I do pseudoapp install broadcom sda dkms.

**14:24** · Boom. Oh, subprocess returned an error code. Should I worry about that? Errors were encountered while processing Broadcom SDA DKMS. What does that mean?

**14:34** · Oh, wait. Software updater. Updated software has been issued since Ubuntu was released. Do you want to install it?

**14:40** · Okay, install. No, not sure what I'm doing here. Authentication required. Let's disconnect the mouse and connect the keyboard and connect the mouse again. Hey, downloading Linux firmware.

**14:51** · Well, maybe this updates it. I'm dying to explore this operating system and I can't because I don't have a keyboard and mouse and anything. System program problem detected. Do you want to reboot the problem? Oh, report the problem. I am actually blind. Try if there's a possible solution here. T2 Linux.org.

**15:09** · Linux support for Apple devices with a T2 security chip. Here we go. Getting Wi-Fi and Bluetooth to work. We now use a script that can help you set up Wi-Fi and Bluetooth. Click here to download the script. You have to run the firmware script on Linux. You run with bash something. Option two. There are a bunch of options. Which one do I choose? So, this is the file that I downloaded from that website on Mac. And it essentially says to run this on Ubuntu. So, I'll just move this over to the flash drive and then run it.

**15:37** · If I go to my desktop, well, this is like a normal user who has never tinkered with Linux before would probably just get lost and quit or just buy a new Apple computer. So this is more steps than I thought would be required for sure. Or maybe in my classic fashion I did something wrong.

**15:56** · Okay. Then I do bash firmware sh. How do you want to copy the firmware to Linux?

**16:01** · Retrieve the firmware from the EFI partition. Retrieve the firmware directly from Mac OS. Download a Mac OS recovery image from Apple. Note if you're choosing option one, then make sure you have run the same script on Mac OS before and choose option one. Okay. I have not done that. Okay, let's switch over to Mac OS and do this. Oh, it's so nice to be able to use the keyboard and the trackpad. So, let's open the terminal. Let's cd into desktop, which just means go there through the terminal. And now, let's do bash, which means just run this in this programming language, I guess. And then firmware sh.

**16:37** · How do you want to copy the firmware?

**16:39** · So, let's say one now and enter. Volume efi on disk mounted. Getting Wi-Fi and Bluetooth firmware. Okay, I think it did everything. Run the following commands or run this script itself in Linux. Now to set up Wi-Fi. Okay, let's switch back to Linux and finally hopefully set this up. Let's cd into desktop again, which just means go there and bash firmware sh please work. Now select one. Enter.

**17:06** · Remounting the efi partition. Installing Wi-Fi. That's funny. Maybe I can also install more RAM. Done. Really? Is it actually Oh, this took like way too long. Okay, I'm trying to connect my mouse with Bluetooth so that I don't have to have like all of this here. It says connected. My mouse is blinking all sorts of colors, but if I try to move it, nothing happens. My god. Now, somehow this mouse just no longer works with my main computer after I plugged it into Ubuntu.

**17:38** · See, the cursor is no longer moving. And when I switch to Bluetooth now, it goes all rainbow. Look at the mess on my desk, by the way. God, this is so annoying to set up. I keep having to like switch these out. This is for the mouse. This is for the flash drive that's inside of another computer. Now, this is my keyboard. I constantly plug it in between different computers.

**18:00** · All because this trackpad and this keyboard do not work.

**18:05** · At least Wi-Fi works. I did have to redo this script a couple times because it like magically stops working. Not sure what that's about, but hopefully this problem maybe disappears. MacBook keyboard and trackpad issues in Ubuntu are usually caused by missing drivers for Apple SPI bus. Try Ubuntu 2204. The problem starts from 2404. Oh, the one that I have. Let's try the basic setup first. Remove any existing module.

**18:34** · Pseudo mod probe Apple SPI. You know, let's just ask Chad GBT. Maybe install the required drivers. Okay, let's do that. Open up the terminal and just paste it in subprocess USR bin dackage returned an error code one. This means a package failed to install or continue and now deep package is in a broken state. Classic. Okay, now I'm just pasting commands from chat GPT which usually never turns out good. So let's see the chaos that ensues.

**19:02** · After removing broadcom STA, your Wi-Fi may stop working temporarily. Try open- source driver instead. There's no way an average person would ever like set this up. I've like installed Linux before and I'm having massive trouble. Install full T2 Linux support recommended for newer Intel MacBooks. I've followed it before.

**19:26** · Wait, T2 Linux project. This website got the Wi-Fi to work, so surely they can get the keyboard to work. Thanks to t2in.org, the installation of Ubuntu worked like a charm. Okay, good for you. Wait, am I going to need to reinstall Ubuntu entirely for this to work? Surely not, right? Surely not. The ISOs from this repo should allow you to install Ubuntu in its flavors without using an external keyboard or mouse on a T2 Mac.

**19:53** · I think I should just do that. It's great that I've wasted two days trying to get this to work. Listed below are the currently available installer ISOs for download. Ooh, there's Arch Linux as well. Cashios, not sure what that is.

**20:06** · Oh, so this T2 person or company essentially sets up the ISO file so that it has all of the Wi-Fi drivers and stuff. Hopefully, there are a bunch of Ubuntu versions. Which one do I pick?

**20:19** · Download the ISO.sh script if you're using Mac OS or Linux or ISO bat script if you're using Windows from the assets below. Run it on the terminal and follow the onscreen instructions. Okay, so I'm using Windows here. ISO bat is what I need. Boink. The publisher could not be verified. This is very risky. Okay. Choose the flavor of Ubuntu you wish to install. Ubuntu regular, I guess. 2404 Noble Numbat or 2510 questing Quoka. What are these names?

**20:51** · I guess let's go with like the more recent version. Why not?

**20:54** · Downloading part one for Ubuntu. Verifying Shaw. Wo, it's gone. Are we good to go? Wait, what happened? Why did it close? Do I open this again? It's downloading again. Okay, let's cancel. Not sure what happened. Why did it just say downloading and stopped? Is it in my downloads? Oh, it is. It is. It is.

**21:12** · Okay, so now we have the ISO file. We don't need this one anymore. Boom. And the next thing I need is to put this ISO onto the USB again. So, I'm going to use Rufus for that. The ISO file you have selected does not match is declared size. 4.9 GB of data is missing. Oh, so when I ran the script again and started downloading this, it just overrid the actual file that was downloaded. Okay.

**21:36** · Well, so wait, let's get the ISO bat file back, delete this, and run it again. Because if you run it on top of itself, it probably just overrides the file. Okay, all that I should need to do now is plug in the USB, restart the computer, hold option, and we should be able to install this. Uh-oh. cannot mount dev loop one on minimal standard something. Should I be worried about this, please? Okay. Error failure loading sector from something and it just has the black screen.

**22:06** · Yeah, I'm plugging it out. If it doesn't work now, then we're in big trouble. Are we in big trouble? Oh, we are in massive trouble.

**22:14** · Wait, what do I do now? There's no USB even plugged in. What if I do enter?

**22:18** · Nothing. What if I do exit? Enter. Oh, hello. It worked. Wait, I was just guessing. I didn't even know that exit exists.

**22:27** · If this works now, I'm a professional. I am a professional. I just repartitioned the disc on Mac OS. Maybe this now works. I choose the USB, which is this one. Enter. It says try or install Auntu. Okay, it still doesn't work. The normal Ubuntu doesn't work. The keyboard doesn't work. The track nothing works pretty much. And this one also doesn't work. I didn't expect that the installation would be the hardest part of this. Okay, it says cannot mount dev loop one.

**22:55** · It often indicates a corrupt squash FS file system, faulty ISO during installation, or missing loop device modules. To fix, detach the loop device. Uh, okay. The problem turned out to be a defective USB drive. Trashed the bad one and used another one, and it's installing this very moment without problems. So, it seems like the problem is with the USB. Okay, now I'm going to try to do this with Bellena Etcher.

**23:22** · Maybe it works better. How am I struggling at this step? This is crazy. This is the third day I'm just trying to install this. I haven't even like jumped in and tried to explore what's there. No need to rage. No need to rage. It's okay. Come on. Work. Work. Oh, let's go.

**23:39** · It actually and the trackpad works as well. Oh, baby. And the thing the thing works, too. Oh my god. Let's go. Okay, I will do the installation and be right back. We are sorry, but we're not sure what the error is. System program detected. Why did I get so happy so early? Let's try this again. Okay, I just ran the installer again and now it worked. Did nothing else. Just restarted, plugged it back in. How does that make any sense? We are finally in.

**24:11** · Touchpad works. Keyboard also works. Let's first install AirDrop. It's called local send. Local send. Share files to nearby devices. We are using Debian. So, let's do Debian. Open with file roller or app center. I guess app center or file roller. Who knows? I should have probably done app center then.

**24:33** · Potentially unsafe. This package is provided by a third party. Install. And it's installing. Computer fans are starting to spin up. Let's see. Do trackpads gestures work? Yes, they do. I can swipe with three fingers to change desktops. I think you swipe up and there's search local send. Boom. Beautiful. I am efficient potato. You know, first things first, let's set up a wallpaper. I'm not a huge fan of this kangaroo. Oh, look at the new one.

**25:00** · Beautiful. These wallpapers just make me excited to use my computer. So, Ubuntu has the Gnome desktop environment. I tried it in another video, so I'm pretty familiar with how this thing works. There are desktops that you can create. If I want, I can add multiple desktops and then switch between them like this. I'm noticing there are a bunch of other apps. Thunderbird mail. Unpin files.

**25:21** · Self-explanatory. Rhythm Box. What's that? Oh, this is like Apple Music or Spotify. Libre Office Writer. This is like Microsoft Word just worse. And free like a lot of things with Linux. Oh, yes. The control key now became the command key. By the way, if when you type you delete words like this, when you make a mistake, that is a rookie move. Try pressing control and delete, which deletes the entire word. It's a lot easier for your brain to retype everything rather than to correct one letter like this. Anyway, then there's app center, help, and local send.

**25:52** · Let's delete help and go to the app center. I want to download and try to play a game, maybe Minecraft or something to see how it performs here. And then I will switch to Mac OS and try to do the same. Minecraft installer. Is this the official Minecraft or no? By James Tigert. Doesn't sound very official.

**26:12** · Ooh, Proton Pass. Let's get this one. So amazing that now the touchpad works as well. I can mute everything. I can play and pause. You know what? Let's get the Minecraft installer as well. And wait for the computer to cool down because it's really loud. Okay. Is it installed?

**26:27** · Yes, it is. Minecraft. Ooh, I'm excited to try to play this. Like I want to see how much faster it is than on Mac OS. I stopped recording on the MacBook screen to get the most raw performance. Is it performing? It's a little laggy. 40 fps. 50 fps. Let's set everything to fast and turn off VSync, of course. 50 fps still.

**26:48** · And the computer fans are going crazy. I want to see what happens if we do this on Mac OS. Here we go. The same setup. I'm not recording my screen. Here we go. Which one wins? 68fps. So, Mac OS wins, I guess. And the experience of playing is much smoother.

**27:07** · Before it was like weirdly choppy. Okay, now it's slightly dropping 30fps, 50 fps. So, I think when the computer heats up, it just starts slowing down obviously. Well, let's switch back and see what else is there. Okay, when I'm not recording the screen, it feels super responsive and fast. Like, everything is instant. I click on apps. Oh, opens immediately. When I'm recording the screen, it is struggling.

**27:34** · Mac OS is not struggling when it's recording the screen. Dark mode. Ooh, look at that. I think from this I can access my drive on Mac OS. Let's try it. Yeah, I'm pretty sure this is my Mac OS system. So, if I go into users, folder is empty. Maybe not. Applications folder is empty. Maybe this is not what it is. I can change the position on the screen.

**27:56** · This looks so weird, but I like it on the left. This is where I have my doc on Mac OS as well. Oh, what's great with Gnome, by the way, is if you open multiple windows of the same app, you can see there's like more dots that appear. On Mac OS, there's a maximum of just one dot. So, if you open more than one window of an application, you don't know that it's open. So, how was my Linux on Mac experience so far? Well, the installation was a massive pain, mostly because I didn't know which Linux ISO to download. that T2 Linux exists.

**28:26** · Although some people that tried doing this might also not know. But other than that, this feels very responsive and very usable. I'm not yet sure if it's faster than Mac OS or not. Maybe the trackpad smoothness or trackpad behavior is slightly different. Linux has a different mouse acceleration curves. So yeah, hopefully this Mac now becomes a little faster. Oh, that reminds me. One thing that happened previously was that I closed the laptop and the Wi-Fi stopped working when I opened it. Let's see if that happens as well. Nope, it now works perfectly fine.

**28:58** · Aha, touchpad doesn't work. Yeah, so sometimes when you close the computer and open it back up again, some things just don't work.

**29:07** · Yeah, look, this is later. I had the laptop lid closed and now there's no longer Wi-Fi. No matter what I do, it just doesn't exist. So, it's been a little bit of time since I installed Ubuntu on the MacBook, and I don't think I'll keep using it. The Wi-Fi randomly turning off, the touch bar not working randomly as well. Sometimes when I close the lid, it keeps using the battery. So, it's not really the best laptop experience, especially compared to how well Mac OS does it.

**29:36** · Oh, and there's one more thing that I completely forgot to mention.

**29:43** · ELEMENT OF SURPRISE.