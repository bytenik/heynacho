# HeyNacho

A Slack bot for team recognition using nachos! Inspired by another popular Slack app, HeyNacho allows team members to show appreciation by giving :nacho: to each other.

## Features

- **Give Nachos**: Recognize teammates by mentioning them with a :nacho: emoji
- **Daily Limits**: Each user gets 5 nachos to give per day
- **Leaderboards**: Track top nacho receivers and givers
- **User Stats**: View personal nacho statistics
- **Persistent Storage**: All data stored in MongoDB
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Prerequisites

- Node.js 22+ (or Docker)
- MongoDB 8.0+ (or use Docker Compose)
- pnpm 10.18.1+
- A Slack workspace with admin access

## Slack App Setup

### Method 1: Using App Manifest (Recommended - Quick & Easy)

1. **Create a Slack App from Manifest**:

   - Go to https://api.slack.com/apps
   - Click "Create New App" → "From an app manifest"
   - Select your workspace
   - Copy and paste the contents of `manifest.yml` from this repository
   - Click "Create"
   - Review the app configuration and click "Confirm"

2. **Enable Socket Mode**:

   - Go to "Socket Mode" in the left sidebar
   - Toggle "Enable Socket Mode" on (if not already enabled)
   - Click "Generate" to create an app-level token with `connections:write` scope
   - Copy and save the token as `SLACK_APP_TOKEN`

3. **Install the App**:

   - Go to "OAuth & Permissions"
   - Click "Install to Workspace"
   - Review permissions and click "Allow"
   - Copy the "Bot User OAuth Token" as `SLACK_BOT_TOKEN`

4. **Get Signing Secret**:

   - Go to "Basic Information"
   - Copy the "Signing Secret" as `SLACK_SIGNING_SECRET`

5. **Add Custom Emoji**:
   - Go to your Slack workspace settings
   - Navigate to "Customize" → "Emoji"
   - Add a custom emoji called `:nacho:`
   - Upload a nacho image (find one online or create your own)

### Method 2: Manual Setup (Alternative)

<details>
<summary>Click to expand manual setup instructions</summary>

1. **Create a Slack App**:

   - Go to https://api.slack.com/apps
   - Click "Create New App" → "From scratch"
   - Name it "HeyNacho" and select your workspace

2. **Enable Socket Mode**:

   - Go to "Socket Mode" in the left sidebar
   - Toggle "Enable Socket Mode" on
   - Generate an app-level token with `connections:write` scope
   - Save the token as `SLACK_APP_TOKEN`

3. **Configure Bot Token Scopes**:

   - Go to "OAuth & Permissions"
   - Add the following Bot Token Scopes:
     - `app_mentions:read`
     - `channels:history`
     - `channels:read`
     - `chat:write`
     - `commands`
     - `groups:history`
     - `groups:read`
     - `im:history`
     - `im:read`
     - `mpim:history`
     - `mpim:read`
     - `users:read`
   - Install the app to your workspace
   - Save the "Bot User OAuth Token" as `SLACK_BOT_TOKEN`

4. **Enable Event Subscriptions**:

   - Go to "Event Subscriptions"
   - Toggle "Enable Events" on
   - Subscribe to bot events:
     - `app_mention`
     - `message.channels`
     - `message.groups`
     - `message.im`
     - `message.mpim`

5. **Create Slash Commands**:
   Create the following slash commands (Settings → Slash Commands):

   - `/nachos-balance` - Check your nacho balance
   - `/nachos-leaderboard` - View leaderboards
   - `/nachos-stats` - View your statistics
   - `/nachos-help` - Show help message
   - `/nachos-admin` - Admin dashboard

6. **Add Custom Emoji**:

   - Go to your Slack workspace
   - Add a custom emoji called `:nacho:`
   - Upload a nacho image

7. **Get Signing Secret**:
   - Go to "Basic Information"
   - Copy the "Signing Secret" as `SLACK_SIGNING_SECRET`

</details>

## Installation

### Local Development

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd nachobot
   ```

2. **Install dependencies**:

   ```bash
   corepack enable
   corepack prepare pnpm@10.18.1 --activate
   pnpm install
   ```

3. **Configure environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your Slack credentials
   ```

4. **Start MongoDB**:

   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:8.0

   # Or use your local MongoDB installation
   ```

5. **Run the bot**:

   ```bash
   # Development mode with auto-reload
   pnpm dev

   # Production mode
   pnpm build
   pnpm start
   ```

### Docker Deployment

1. **Configure environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your Slack credentials
   ```

2. **Start with Docker Compose**:

   ```bash
   docker-compose up -d
   ```

3. **View logs**:

   ```bash
   docker-compose logs -f nachobot
   ```

4. **Stop the bot**:
   ```bash
   docker-compose down
   ```

## Usage

### Giving Nachos

Mention a teammate with a :nacho: emoji in any channel where the bot is present:

```
@username :nacho: Great job on the presentation!
```

You can give nachos to multiple people in one message:

```
@alice @bob :nacho: Awesome teamwork on the project!
```

### Commands

- **`/nachos-balance`**: Check your nacho balance and remaining nachos for today
- **`/nachos-leaderboard`**: View top nacho receivers and givers
- **`/nachos-stats`**: View your personal statistics and recent activity
- **`/nachos-help`**: Display help message with usage instructions
- **`/nachos-admin`**: View admin dashboard with overall statistics

## Project Structure

```
nachobot/
├── src/
│   ├── bot/               # Slack bot setup
│   │   ├── app.ts        # Main bot application
│   │   ├── events/       # Event handlers
│   │   └── commands/     # Slash command handlers
│   ├── db/               # Database layer
│   │   ├── client.ts     # MongoDB connection
│   │   ├── collections.ts # Collection references
│   │   └── queries/      # Database queries
│   ├── services/         # Business logic
│   │   ├── nacho.service.ts
│   │   ├── user.service.ts
│   │   └── stats.service.ts
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration management
│   └── index.ts          # Application entry point
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Configuration

### Environment Variables

| Variable               | Description                                              | Default                              |
| ---------------------- | -------------------------------------------------------- | ------------------------------------ |
| `SLACK_BOT_TOKEN`      | Bot User OAuth Token                                     | Required                             |
| `SLACK_APP_TOKEN`      | App-level token for Socket Mode                          | Required                             |
| `SLACK_SIGNING_SECRET` | App signing secret                                       | Required                             |
| `MONGODB_URI`          | MongoDB connection string (include database name in URI) | `mongodb://localhost:27017/nachobot` |
| `PORT`                 | Application port                                         | `3000`                               |
| `DAILY_NACHO_LIMIT`    | Daily nacho limit per user                               | `5`                                  |
| `TZ`                   | Timezone for daily reset                                 | `America/New_York`                   |

## Database Schema

### Collections

**users**:

- `slackId`: User's Slack ID (unique)
- `slackUsername`: User's Slack username
- `nachosReceived`: Total nachos received
- `nachosGiven`: Total nachos given
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

**transactions**:

- `fromUserId`: Sender's Slack ID
- `toUserId`: Receiver's Slack ID
- `message`: Recognition message
- `channel`: Slack channel ID
- `timestamp`: Transaction timestamp

**dailyLimits**:

- `userId`: User's Slack ID
- `date`: Date (midnight UTC)
- `nachosGiven`: Number of nachos given today

## Development

### Build

```bash
pnpm build
```

### Type Checking

```bash
pnpm type-check
```

### Watch Mode

```bash
pnpm dev
```

## Troubleshooting

### Bot doesn't respond to messages

- Ensure the bot is invited to the channel: `/invite @HeyNacho`
- Check that Socket Mode is enabled in your Slack app
- Verify all required bot scopes are added
- Check the bot logs for errors

### Database connection issues

- Verify MongoDB is running: `docker ps` or check local MongoDB
- Check the `MONGODB_URI` environment variable
- Ensure MongoDB is accessible from your application

### Slash commands not working

- Verify slash commands are created in your Slack app
- Check that the command names match exactly
- Ensure the bot has the `commands` scope

## License

ISC

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
