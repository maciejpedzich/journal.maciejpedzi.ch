---
title: Operation "PlayStation Web Services"
category: psws
description: (Sony pls don't sue) Laying out a game plan for turning my PS4 into
  a DevOps powerhouse
date: 2022-07-24T12:05:42.524Z
---
Hey folks, welcome to the first article from my PSWS series! In these posts I'll describe the entire process of turning my PlayStation 4 into a development Swiss army knife with a Git service, CI/CD pipeline, and even a remote coding environment setup to go with it too!

## But why?

Well, why not? I'm very well aware that I'd probably be better off rolling with a Raspberry Pi, or a 10/15-year-old computer... but I consider the sheer idea of running all that software off of a video game console so much cooler than these two combined. Even if it's not that huge of an undertaking either, I don't care. I just want to play around and share my progress with you, just for the fun of it.

## So, what's the plan?

I'm glad you asked (maybe not, whatever)! First and foremost, I'll need to prepare and install a Ubuntu Server distro onto some external drive, and then jailbreak my PS4 to have it run the OS. I've done this before with already prepared distros, so this part shouldn't prove too difficult. Then I'll move on to installing a Git server. From all the options I've asked my fellow devs about, [Gitea](https://gitea.io/en-us/) was most frequently named as a self-hosted option I should choose, so I guess I'll do so.

Once I've got its setup out of the way, it will be time for preparing a CI/CD pipeline - there are [plenty of choices](https://gitea.com/gitea/awesome-gitea#user-content-devops) out there, but I reckon I'll fly with [Drone](https://github.com/harness/drone) (pun very much intended), because it's based on Docker containers, and I'm looking to get up closer and more personal with them. And last but not least, I'll get to configure [code-server](https://github.com/coder/code-server) for that sweet VSCode-in-your-browser experience. With all the *Infinity Stones* in my developer gauntlet, I'll be all set to start building!

## What are you going to build?

That's another great question, partner! Having recently released [Spotify Playlist Archive Website](https://spotifyplaylistarchive.com/), I'm actually hungry for more Spotify-powered apps. This time around, we're talking listenwith.maciejpedzi.ch, where you can log in via Spotify and join a listening session with yours truly! I'll probably have to make this one invite-only, and besides, I won't have it up and running 24/7, because I don't want to *have a conversation* with my parents once the electricity bill comes up. I'll use Vue 3 and Quasar for the frontend, with self-hosted Supabase as the backend.

## Thanks for reading in!

I hope you enjoyed this one, and are excited for this series' next post, where I'll outline the process of preparing a Linux distro for PS4, and actually getting it to run on that system. Take care!