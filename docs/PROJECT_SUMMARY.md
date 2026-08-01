# Project Summary: Football Auction Platform

## Overview
The **Football Auction Platform** is a high-performance, real-time web application designed to facilitate professional-grade football player auctions. It allows tournament organizers (Super Admins/Auctioneers) to manage player registries, teams to bid on players within strict budget constraints, and viewers to follow the auction live.

## Core Value Proposition
- **Real-Time Bidding**: Powered by Supabase Realtime, providing sub-second synchronization across all connected clients.
- **Atomic Integrity**: Complex bidding logic is handled via PostgreSQL functions to prevent over-bidding, double-selling, or race conditions.
- **Budget Management**: Automatic tracking of team budgets and squad requirements.
- **Role-Based Experience**: Tailored interfaces for Admins, Auctioneers, Team Owners, and Viewers.

## Target Audience
- Local football leagues and tournament organizers.
- Amateur and semi-professional sports clubs.
- Sports enthusiasts running fantasy-style auction events.

## Key Features
- **User Management**: Secure signup and profile management with granular roles.
- **Tournament Orchestration**: Multi-tournament support with custom season settings.
- **Player Registry**: Detailed player stats, categories, and base price settings.
- **Live Auction Room**: Interactive bidding interface with automated timers and increment logic.
- **Analytics**: Historical bid tracking and squad composition reports.
