#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class HDR01App : public App {
  public:
	void setup() override;
	void mouseDown( MouseEvent event ) override;
	void update() override;
	void draw() override;
};

void HDR01App::setup()
{
}

void HDR01App::mouseDown( MouseEvent event )
{
}

void HDR01App::update()
{
}

void HDR01App::draw()
{
	gl::clear( Color( 0, 0, 0 ) ); 
}

CINDER_APP( HDR01App, RendererGl )
