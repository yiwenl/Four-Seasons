#include "cinder/app/AppNative.h"
#include "cinder/gl/gl.h"

#include "SceneApp.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class FourSeasons01App : public AppNative {
  public:
	void setup();
	void mouseDown( MouseEvent event );	
	void update();
	void draw();
    
    
    private :
    SceneApp* _scene;
};

void FourSeasons01App::setup()
{
    setWindowSize(1920, 1080);
    setWindowPos(0, 0);
    setFrameRate(60);
    srand (time(NULL));
    
    gl::disableVerticalSync();
    _scene = new SceneApp(getWindow());
}

void FourSeasons01App::mouseDown( MouseEvent event )
{
}

void FourSeasons01App::update()
{
}

void FourSeasons01App::draw()
{
	// clear out the window with black
	gl::clear( Color( 0, 0, 0 ) );
    _scene->render();

}

CINDER_APP_NATIVE( FourSeasons01App, RendererGl )
