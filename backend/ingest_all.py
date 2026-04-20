"""
Run once to populate Supabase with all mock-data.
Safe to re-run: duplicates are silently ignored via the
unique (source_id, source_type) constraint.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from piazza_utils import (
    process_and_upload_post,
    process_and_upload_material,
    process_and_upload_trending_topic,
    process_and_upload_availability,
)

# ── Paste / import your mock-data dicts here ──────────────────────────────
# The easiest approach: copy the raw Python equivalents of your TS exports.
# Below are stubs — fill in with your actual data.

from mock_data import (   # create mock_data.py that mirrors your TS exports
    piazza_posts,
    course_materials,
    trending_topics,
    availability_schedule,
)

def main():
    print("=== Ingesting course materials ===")
    for mat in course_materials:
        process_and_upload_material(mat)

    print("\n=== Ingesting Piazza posts ===")
    for post in piazza_posts:
        process_and_upload_post(post)

    print("\n=== Ingesting trending topics ===")
    for topic in trending_topics:
        process_and_upload_trending_topic(topic)

    print("\n=== Ingesting availability schedule ===")
    process_and_upload_availability(availability_schedule)

    print("\n✅ All done! Re-running is safe — duplicates are skipped.")

if __name__ == "__main__":
    main()