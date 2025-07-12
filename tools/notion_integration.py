#!/usr/bin/env python3
"""
Lichtara OS - Notion Integration Tool

A comprehensive integration tool for connecting Lichtara OS with Notion workspaces.
This tool enables seamless data synchronization, content management, and collaborative
workflows between the Lichtara OS platform and Notion databases.

Author: Lichtara OS Team
License: MIT
Version: 1.0.0
"""

import os
import sys
import json
import logging
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any, Union

import click
import requests
from dotenv import load_dotenv
from notion_client import Client
from notion_client.errors import APIResponseError, RequestTimeoutError
from pydantic import BaseModel, Field
from rich.console import Console
from rich.progress import Progress, TaskID
from rich.table import Table
from rich.logging import RichHandler

# Load environment variables
load_dotenv()

# Initialize rich console
console = Console()

# Configure logging
logging.basicConfig(
    level=getattr(logging, os.getenv('LOG_LEVEL', 'INFO')),
    format="%(message)s",
    datefmt="[%X]",
    handlers=[RichHandler(console=console)]
)

logger = logging.getLogger("notion_integration")


class NotionConfig(BaseModel):
    """Configuration model for Notion integration."""
    
    api_token: str = Field(..., description="Notion API integration token")
    database_id: Optional[str] = Field(None, description="Default database ID")
    page_id: Optional[str] = Field(None, description="Default page ID")
    workspace_name: str = Field("Lichtara OS", description="Workspace name")
    rate_limit: int = Field(3, description="API rate limit (requests per second)")
    max_retries: int = Field(3, description="Maximum retry attempts")
    retry_delay: float = Field(1.0, description="Delay between retries in seconds")
    debug_mode: bool = Field(False, description="Enable debug mode")
    dry_run: bool = Field(False, description="Enable dry run mode")


class NotionIntegration:
    """Main class for Notion integration functionality."""
    
    def __init__(self, config: NotionConfig):
        """Initialize the Notion integration with configuration."""
        self.config = config
        self.client = Client(auth=config.api_token)
        self.last_request_time = 0
        
        # Create backup directory if enabled
        if os.getenv('ENABLE_BACKUP', 'true').lower() == 'true':
            backup_dir = Path(os.getenv('BACKUP_DIRECTORY', './backups'))
            backup_dir.mkdir(exist_ok=True)
    
    def _rate_limit(self) -> None:
        """Implement rate limiting for API requests."""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        min_interval = 1.0 / self.config.rate_limit
        
        if time_since_last < min_interval:
            sleep_time = min_interval - time_since_last
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()
    
    def _retry_request(self, func, *args, **kwargs) -> Any:
        """Execute a function with retry logic."""
        for attempt in range(self.config.max_retries):
            try:
                self._rate_limit()
                return func(*args, **kwargs)
            except (APIResponseError, RequestTimeoutError) as e:
                if attempt == self.config.max_retries - 1:
                    logger.error(f"Request failed after {self.config.max_retries} attempts: {e}")
                    raise
                logger.warning(f"Request failed (attempt {attempt + 1}), retrying in {self.config.retry_delay}s...")
                time.sleep(self.config.retry_delay)
    
    def test_connection(self) -> bool:
        """Test the connection to Notion API."""
        try:
            logger.info("Testing Notion API connection...")
            response = self._retry_request(self.client.users.me)
            
            if response:
                logger.info(f"✅ Successfully connected to Notion as: {response.get('name', 'Unknown')}")
                return True
        except Exception as e:
            logger.error(f"❌ Failed to connect to Notion: {e}")
            return False
    
    def list_databases(self) -> List[Dict[str, Any]]:
        """List all accessible databases."""
        try:
            logger.info("Retrieving databases...")
            response = self._retry_request(self.client.search, filter={"property": "object", "value": "database"})
            
            databases = response.get('results', [])
            logger.info(f"Found {len(databases)} accessible databases")
            
            return databases
        except Exception as e:
            logger.error(f"Failed to retrieve databases: {e}")
            return []
    
    def get_database_schema(self, database_id: str) -> Dict[str, Any]:
        """Get the schema of a specific database."""
        try:
            logger.info(f"Retrieving schema for database: {database_id}")
            response = self._retry_request(self.client.databases.retrieve, database_id)
            
            schema = {
                'id': response['id'],
                'title': response.get('title', [{}])[0].get('plain_text', 'Untitled'),
                'properties': response.get('properties', {}),
                'created_time': response.get('created_time'),
                'last_edited_time': response.get('last_edited_time')
            }
            
            logger.info(f"Retrieved schema for database: {schema['title']}")
            return schema
        except Exception as e:
            logger.error(f"Failed to retrieve database schema: {e}")
            return {}
    
    def query_database(self, database_id: str, filter_criteria: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """Query a database with optional filters."""
        try:
            logger.info(f"Querying database: {database_id}")
            
            query_params = {}
            if filter_criteria:
                query_params['filter'] = filter_criteria
            
            response = self._retry_request(self.client.databases.query, database_id, **query_params)
            
            results = response.get('results', [])
            logger.info(f"Query returned {len(results)} results")
            
            return results
        except Exception as e:
            logger.error(f"Failed to query database: {e}")
            return []
    
    def create_page(self, database_id: str, properties: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new page in a database."""
        if self.config.dry_run:
            logger.info(f"[DRY RUN] Would create page in database {database_id} with properties: {properties}")
            return {"id": "dry_run_page_id", "url": "https://notion.so/dry-run"}
        
        try:
            logger.info(f"Creating page in database: {database_id}")
            
            page_data = {
                "parent": {"database_id": database_id},
                "properties": properties
            }
            
            response = self._retry_request(self.client.pages.create, **page_data)
            
            logger.info(f"✅ Created page: {response['id']}")
            return response
        except Exception as e:
            logger.error(f"Failed to create page: {e}")
            return None
    
    def update_page(self, page_id: str, properties: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing page."""
        if self.config.dry_run:
            logger.info(f"[DRY RUN] Would update page {page_id} with properties: {properties}")
            return {"id": page_id, "url": f"https://notion.so/{page_id}"}
        
        try:
            logger.info(f"Updating page: {page_id}")
            
            response = self._retry_request(self.client.pages.update, page_id, properties=properties)
            
            logger.info(f"✅ Updated page: {page_id}")
            return response
        except Exception as e:
            logger.error(f"Failed to update page: {e}")
            return None
    
    def export_data(self, database_id: str, output_file: Optional[str] = None) -> bool:
        """Export database data to JSON file."""
        try:
            logger.info(f"Exporting data from database: {database_id}")
            
            # Get database schema
            schema = self.get_database_schema(database_id)
            
            # Query all data
            data = self.query_database(database_id)
            
            # Prepare export
            export_data = {
                'metadata': {
                    'export_time': datetime.now().isoformat(),
                    'database_id': database_id,
                    'database_title': schema.get('title', 'Unknown'),
                    'record_count': len(data)
                },
                'schema': schema,
                'data': data
            }
            
            # Determine output file
            if not output_file:
                output_file = os.getenv('OUTPUT_FILE', 'notion_export.json')
            
            # Write to file
            output_path = Path(output_file)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Exported {len(data)} records to: {output_path}")
            
            # Create backup if enabled
            if os.getenv('ENABLE_BACKUP', 'true').lower() == 'true':
                backup_dir = Path(os.getenv('BACKUP_DIRECTORY', './backups'))
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                backup_file = backup_dir / f"notion_export_{timestamp}.json"
                
                with open(backup_file, 'w', encoding='utf-8') as f:
                    json.dump(export_data, f, indent=2, ensure_ascii=False)
                
                logger.info(f"📁 Backup created: {backup_file}")
            
            return True
        except Exception as e:
            logger.error(f"Failed to export data: {e}")
            return False
    
    def display_databases_table(self, databases: List[Dict[str, Any]]) -> None:
        """Display databases in a formatted table."""
        table = Table(title="Accessible Notion Databases")
        table.add_column("ID", style="cyan", no_wrap=True)
        table.add_column("Title", style="magenta")
        table.add_column("Created", style="green")
        table.add_column("Last Edited", style="yellow")
        
        for db in databases:
            title = db.get('title', [{}])[0].get('plain_text', 'Untitled') if db.get('title') else 'Untitled'
            created = db.get('created_time', 'Unknown')[:10] if db.get('created_time') else 'Unknown'
            edited = db.get('last_edited_time', 'Unknown')[:10] if db.get('last_edited_time') else 'Unknown'
            
            table.add_row(db['id'], title, created, edited)
        
        console.print(table)


def load_config() -> NotionConfig:
    """Load configuration from environment variables."""
    api_token = os.getenv('NOTION_API_TOKEN')
    if not api_token:
        raise ValueError("NOTION_API_TOKEN environment variable is required")
    
    return NotionConfig(
        api_token=api_token,
        database_id=os.getenv('NOTION_DATABASE_ID'),
        page_id=os.getenv('NOTION_PAGE_ID'),
        workspace_name=os.getenv('NOTION_WORKSPACE_NAME', 'Lichtara OS'),
        rate_limit=int(os.getenv('API_RATE_LIMIT', 3)),
        max_retries=int(os.getenv('MAX_RETRIES', 3)),
        retry_delay=float(os.getenv('RETRY_DELAY', 1.0)),
        debug_mode=os.getenv('DEBUG_MODE', 'false').lower() == 'true',
        dry_run=os.getenv('DRY_RUN', 'false').lower() == 'true'
    )


@click.group()
@click.option('--debug', is_flag=True, help='Enable debug mode')
@click.option('--dry-run', is_flag=True, help='Enable dry run mode')
@click.pass_context
def cli(ctx, debug, dry_run):
    """Lichtara OS Notion Integration Tool
    
    A comprehensive tool for integrating Lichtara OS with Notion workspaces.
    """
    ctx.ensure_object(dict)
    
    if debug:
        os.environ['DEBUG_MODE'] = 'true'
        logging.getLogger().setLevel(logging.DEBUG)
    
    if dry_run:
        os.environ['DRY_RUN'] = 'true'
        console.print("[bold yellow]🔍 DRY RUN MODE ENABLED - No changes will be made[/bold yellow]")


@cli.command()
def test():
    """Test the connection to Notion API."""
    try:
        config = load_config()
        integration = NotionIntegration(config)
        
        if integration.test_connection():
            console.print("[bold green]✅ Connection test successful![/bold green]")
            sys.exit(0)
        else:
            console.print("[bold red]❌ Connection test failed![/bold red]")
            sys.exit(1)
    except Exception as e:
        logger.error(f"Configuration error: {e}")
        sys.exit(1)


@cli.command()
def list_databases():
    """List all accessible databases."""
    try:
        config = load_config()
        integration = NotionIntegration(config)
        
        databases = integration.list_databases()
        if databases:
            integration.display_databases_table(databases)
        else:
            console.print("[yellow]No databases found or accessible.[/yellow]")
    except Exception as e:
        logger.error(f"Error listing databases: {e}")
        sys.exit(1)


@cli.command()
@click.option('--database-id', required=True, help='Database ID to export')
@click.option('--output', help='Output file path (default: notion_export.json)')
def export(database_id, output):
    """Export database data to JSON file."""
    try:
        config = load_config()
        integration = NotionIntegration(config)
        
        if integration.export_data(database_id, output):
            console.print("[bold green]✅ Export completed successfully![/bold green]")
        else:
            console.print("[bold red]❌ Export failed![/bold red]")
            sys.exit(1)
    except Exception as e:
        logger.error(f"Export error: {e}")
        sys.exit(1)


@cli.command()
@click.option('--database-id', required=True, help='Database ID to query')
@click.option('--filter', help='JSON filter criteria (optional)')
def query(database_id, filter):
    """Query a database with optional filters."""
    try:
        config = load_config()
        integration = NotionIntegration(config)
        
        filter_criteria = None
        if filter:
            filter_criteria = json.loads(filter)
        
        results = integration.query_database(database_id, filter_criteria)
        
        console.print(f"[bold]Query Results: {len(results)} records[/bold]")
        for i, result in enumerate(results[:5], 1):  # Show first 5 results
            console.print(f"{i}. {result.get('id', 'Unknown ID')}")
        
        if len(results) > 5:
            console.print(f"... and {len(results) - 5} more records")
            
    except Exception as e:
        logger.error(f"Query error: {e}")
        sys.exit(1)


@cli.command()
@click.option('--database-id', required=True, help='Database ID to inspect')
def schema(database_id):
    """Display database schema information."""
    try:
        config = load_config()
        integration = NotionIntegration(config)
        
        schema = integration.get_database_schema(database_id)
        if schema:
            console.print(f"[bold]Database: {schema['title']}[/bold]")
            console.print(f"ID: {schema['id']}")
            console.print(f"Created: {schema.get('created_time', 'Unknown')}")
            console.print(f"Last Edited: {schema.get('last_edited_time', 'Unknown')}")
            console.print("\n[bold]Properties:[/bold]")
            
            for prop_name, prop_config in schema.get('properties', {}).items():
                prop_type = prop_config.get('type', 'unknown')
                console.print(f"  • {prop_name}: {prop_type}")
        else:
            console.print("[red]Failed to retrieve database schema.[/red]")
            sys.exit(1)
            
    except Exception as e:
        logger.error(f"Schema error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    cli()