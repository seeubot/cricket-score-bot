import logging
from telegram import Update
from telegram.ext import (
    Application, 
    CommandHandler, 
    ContextTypes, 
    MessageHandler, 
    filters
)
from services.score_service import ScoreService
from config.settings import Config

class TelegramBot:
    def __init__(self, token: str):
        self.token = token
        self.score_service = ScoreService()
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
            level=getattr(logging, Config.LOG_LEVEL)
        )

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle the /start command."""
        welcome_message = (
            "Welcome to Cricket Live Score Bot! 🏏\n\n"
            "Available commands:\n"
            "/match - Get current match details\n"
            "/ball_by_ball - Get ball-by-ball updates\n"
            "/help - Show help menu"
        )
        await update.message.reply_text(welcome_message)

    async def match_details(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Fetch and display current match details."""
        try:
            match_info = self.score_service.get_current_match()
            if match_info:
                await update.message.reply_text(f"Current Match: {match_info}")
            else:
                await update.message.reply_text("No live matches at the moment.")
        except Exception as e:
            self.logger.error(f"Error fetching match details: {e}")
            await update.message.reply_text("Sorry, could not fetch match details.")

    async def ball_by_ball_updates(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Provide ball-by-ball updates for the current match."""
        try:
            ball_updates = self.score_service.get_ball_by_ball_updates()
            if ball_updates:
                await update.message.reply_text(ball_updates)
            else:
                await update.message.reply_text("No updates available at the moment.")
        except Exception as e:
            self.logger.error(f"Error fetching ball-by-ball updates: {e}")
            await update.message.reply_text("Sorry, could not fetch ball-by-ball updates.")

    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Display help information."""
        help_message = (
            "Cricket Live Score Bot Help 🏏\n\n"
            "Commands:\n"
            "/start - Start the bot\n"
            "/match - Get current match details\n"
            "/ball_by_ball - Get ball-by-ball updates\n"
            "/help - Show this help menu"
        )
        await update.message.reply_text(help_message)

    def run(self):
        """Run the Telegram bot."""
        try:
            # Create the Application and pass it your bot's token
            application = Application.builder().token(self.token).build()

            # Register command handlers
            application.add_handler(CommandHandler("start", self.start))
            application.add_handler(CommandHandler("match", self.match_details))
            application.add_handler(CommandHandler("ball_by_ball", self.ball_by_ball_updates))
            application.add_handler(CommandHandler("help", self.help_command))

            # Start the bot
            self.logger.info("Starting Telegram Bot...")
            application.run_polling(drop_pending_updates=True)
        except Exception as e:
            self.logger.error(f"Error running Telegram bot: {e}")

def main():
    bot = TelegramBot(Config.TELEGRAM_BOT_TOKEN)
    bot.run()

if __name__ == '__main__':
    main()
