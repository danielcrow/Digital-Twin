# How to Get Real London Underground Photos

This guide will help you obtain actual London Underground station photos for the digital twin visualization.

## Quick Start - Free Photo Sources

### 1. Wikimedia Commons (Recommended - Best Quality & Legal)

Visit: https://commons.wikimedia.org

**Search Examples:**
- "King's Cross St Pancras Underground platform"
- "Oxford Circus tube station"
- "Victoria station London Underground"
- "Jubilee line Canary Wharf"

**Steps:**
1. Search for the station name + "underground" or "tube"
2. Look for images with these licenses:
   - Public Domain
   - CC0 (Creative Commons Zero)
   - CC-BY-SA (Creative Commons Attribution-ShareAlike)
3. Download the image (choose 1920px or larger)
4. Rename to match the filename in `public/images/README.md`
5. Place in `public/images/` folder

**Example URLs:**
- King's Cross: https://commons.wikimedia.org/wiki/Category:King%27s_Cross_St_Pancras_tube_station
- Oxford Circus: https://commons.wikimedia.org/wiki/Category:Oxford_Circus_tube_station
- Victoria: https://commons.wikimedia.org/wiki/Category:Victoria_tube_station

### 2. Unsplash (Free, No Attribution Required)

Visit: https://unsplash.com

**Search Terms:**
- "London Underground"
- "London tube station"
- "London metro"
- "[Station name] London"

**Steps:**
1. Search for London Underground photos
2. Click "Download free" button
3. Rename and save to `public/images/`

### 3. Pexels (Free, No Attribution Required)

Visit: https://www.pexels.com

**Search Terms:**
- "London Underground"
- "London subway"
- "British tube station"

### 4. Flickr Creative Commons

Visit: https://www.flickr.com/creativecommons/

**Steps:**
1. Search for station names
2. Filter by license type (CC-BY or CC-BY-SA)
3. Check license requirements
4. Download and attribute if required

## Automated Download Script (Optional)

If you want to automate downloading placeholder images from Unsplash:

```bash
# Install curl if not already installed
# Then run this script to download generic London Underground images

mkdir -p public/images

# Download generic London Underground images as placeholders
curl -L "https://source.unsplash.com/1920x1080/?london-underground,platform" -o public/images/kings-cross.jpg
curl -L "https://source.unsplash.com/1920x1080/?london-tube,station" -o public/images/oxford-circus.jpg
curl -L "https://source.unsplash.com/1920x1080/?london-underground,train" -o public/images/victoria.jpg
# ... repeat for other stations
```

## Recommended Stations to Photograph

If you have access to London, these stations have the most interesting architecture:

### Priority 1 (Most Iconic):
1. **King's Cross St. Pancras** - Modern architecture, multiple levels
2. **Canary Wharf** - Futuristic Jubilee line station
3. **Westminster** - Modern Jubilee line with escalators
4. **Southwark** - Unique blue lighting
5. **Stratford** - Olympic Park station

### Priority 2 (Historic/Interesting):
6. **Baker Street** - Original Metropolitan line tiles
7. **Piccadilly Circus** - Classic roundel signage
8. **Bank** - Complex interchange
9. **Liverpool Street** - Busy commuter hub
10. **Paddington** - Victorian architecture

## Photography Tips

If taking your own photos:
- **Time**: Off-peak hours (10am-4pm weekdays)
- **Equipment**: Wide-angle lens (16-35mm)
- **Settings**: ISO 800-1600, f/2.8-4.0
- **Composition**: Include:
  - Platform edge and tracks
  - Station signage and roundels
  - Escalators or stairs
  - Architectural features
  - Some depth/perspective

## Legal Considerations

### TfL Photography Policy:
- Personal photography is generally allowed
- No flash photography
- Don't obstruct passengers
- Commercial use may require permission
- Check: https://tfl.gov.uk/corporate/terms-and-conditions/

### For This Project:
- Educational/demonstration purposes
- Not for commercial distribution
- Attribute photographers when required
- Use Creative Commons or Public Domain images

## File Naming Convention

Save files as:
```
kings-cross.jpg
oxford-circus.jpg
victoria.jpg
liverpool-street.jpg
waterloo.jpg
london-bridge.jpg
paddington.jpg
bank.jpg
stratford.jpg
canary-wharf.jpg
leicester-square.jpg
piccadilly-circus.jpg
green-park.jpg
westminster.jpg
euston.jpg
camden-town.jpg
clapham-common.jpg
brixton.jpg
wembley-park.jpg
heathrow-t5.jpg
```

## Current Status

The application currently uses:
- **Primary**: Local images from `public/images/` folder
- **Fallback**: Unsplash placeholder images (generic London Underground photos)

The system will automatically fall back to placeholders if local images aren't found, so the app works immediately while you source better photos.

## Quick Test

To test with one station:
1. Download any London Underground photo
2. Save as `public/images/kings-cross.jpg`
3. Run `npm run dev`
4. Switch to Station View
5. Select "King's Cross St. Pancras"
6. You should see your photo!

## Attribution Template

If using Creative Commons images, add attribution in your README:

```markdown
## Photo Credits

- King's Cross St. Pancras: [Photographer Name] via Wikimedia Commons (CC-BY-SA)
- Oxford Circus: Photo by [Name] on Unsplash