import {pgTable, text, uuid, integer, boolean, timestamp} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';

export const files = pgTable('files', {
    id: uuid('id').primaryKey().defaultRandom(),

    // Basic file/ folder info
    name: text('name').notNull(),
    path: text('path').notNull(), // /document/project/file.txt
    size: integer('size').notNull(),
    type: text('type').notNull(),

    // storage info
    fileUrl: text('file_url').notNull(),
    thumbnailUrl: text('thumbnail_url').notNull(),

    // Ownership info
    userId: text('user_id').notNull(), // user who uploaded the file
    parentId: uuid('parent_id'), // parent folder id -> Null for root folder
    
    // Folder flags
    isFolder: boolean('is_folder').notNull().default(false), // true if this is a folder
    isStarred: boolean('is_starred').notNull().default(false), // true if this file is starred
    isTrash: boolean('is_trash').notNull().default(false), // true if this file is in trash

    // Timestamps
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    
    
})


/**
 * File Relations
 *
 * This defines the relationships between records in our files table:
 * 1. parent - Each file/folder can have one parent folder
 * 2. children - Each folder can have many child files/folders
 *
 * This creates a hierarchical file structure similar to a real filesystem.
 */

export const filesRelations = relations(files, ({one,many}) => ({ 
    parent: one(files, {
        fields: [files.parentId], // The foreign key in this table
        references: [files.id], // The primary key in the parent table
      }),
    
      // Relationship to child files/folders
      children: many(files),
    }));


    /**
 * Type Definitions
 *
 * These types help with TypeScript integration:
 * - File: Type for retrieving file data from the database
 * - NewFile: Type for inserting new file data into the database
 */
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;